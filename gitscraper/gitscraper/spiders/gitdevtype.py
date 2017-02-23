import scrapy
import requests

class gitdevtype(scrapy.Spider):
    name = "gitdevtype"
    start_urls = [
    'https://github.com/trending/developers',
    ]
    user_api_url='https://api.github.com/users'
    flag=False
    onepage_flag=False
    lastpage=''
    repo_api_url='https://api.github.com/repos'
    organisations_projects=[]
    next_page=''

    def parse(self, response):
        titles=response.css("h2.user-leaderboard-list-name a::attr(href)").extract() 
        
        for ele in titles:
            titles[titles.index(ele)]= ele.encode('ascii','ignore').strip() 

        for ele in titles:
            curruser_api_url=self.user_api_url+ele+'?access_token=5128abbf1346ea3a3a39bbd4bc4f1bf58eef78e1'
            r=requests.get(curruser_api_url)
            if(r.json()['type'] != "Organization"):
                titles.remove(ele)

        for ele in titles:
            flag=False
            lastpage=''
            organisations_projects=[]
            next_page='https://github.com' + ele + '?page=1'
            yield scrapy.Request('https://github.com' + ele + '?page=1', callback=self.save_file)


    def save_file(self, response):
        if self.flag == False:
            allpages = response.css('div.paginate-container a::attr(href)').extract()
            if not allpages:
                self.onepage_flag = True
                self.flag = True
            else:
                secondlast=allpages[-2].encode('ascii','ignore').strip()
                equalindex=secondlast.index('=')
                self.lastpage=secondlast[equalindex+1:]
                self.flag=True

        titles=response.css("div.org-repos li.col-12 div.d-inline-block h3 a::attr(href)").extract()           

        for ele in titles:
            titles[titles.index(ele)]= ele.encode('ascii','ignore').strip()
 

        for ele in titles:
            data={}
            current_repo_url=self.repo_api_url+ele+'?access_token=5128abbf1346ea3a3a39bbd4bc4f1bf58eef78e1'
            print "current repo url", current_repo_url
            r=requests.get(current_repo_url)

            apicall2_url=r.json()['contributors_url'].encode('ascii','ignore')+'?access_token=ae4dbc893ea4a97dfc835fb58c235ec7e8210664'
            s=requests.get(apicall2_url)
            print "No of contributing authors", len(s.json())

            data={

                'project_id':r.json()['id'],
                'project_name':r.json()['name'],
                'forks_count':r.json()['forks_count'],
                'stargazers':r.json()['stargazers_count'],
                'owner_type': 'Organization',
                'start_time':r.json()['created_at'],
                'end_time': r.json()['updated_at'],
                'contrib_authors':len(s.json()),
            }
            self.organisations_projects.append(data)

        if not self.onepage_flag and self.next_page[self.next_page.index('=')+1:] != self.lastpage:
            self.next_page=self.next_page[:self.next_page.index('=')+1] +str(int(self.next_page[self.next_page.index('=')+1:])+1)
            print "This is the next page", self.next_page
            next_url = response.urljoin(self.next_page)
            yield scrapy.Request(next_url, callback=self.save_file)
        else:
            yield{
               r.json()['owner']['login']:self.organisations_projects
            }