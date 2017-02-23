import scrapy
import requests
#import time

class gitdevrepo(scrapy.Spider):
    name = "gitdevrepo"
    start_urls =['https://github.com/facebook?page=1']
    flag=False
    lastpage=''
    next_page=start_urls[0]
    repo_api_url='https://api.github.com/repos'
    organisations_projects=[]
    
    def parse(self, response):
    	if self.flag == False:
            allpages=response.css('div.paginate-container a::attr(href)').extract()
            secondlast=allpages[-2].encode('ascii','ignore').strip()
            equalindex=secondlast.index('=')
            self.lastpage=secondlast[equalindex+1:]
            self.flag=True

        titles=response.css("div.org-repos li.col-12 div.d-inline-block h3 a::attr(href)").extract()           

        for ele in titles:

            titles[titles.index(ele)]= ele.encode('ascii','ignore').strip() 

        for ele in titles:
        	data={}
        	current_repo_url=self.repo_api_url+ele+'?access_token=71f84b49362fd5336913573c94b45aaf98a6f84c'
        	#print "current repo url", current_repo_url
        	#time.sleep(3)
        	r=requests.get(current_repo_url)

        	data={
        		'project_id':r.json()['id'],
        		'project_name':r.json()['name'],
        		'project_description':r.json()['description'],
        		'forks_count':r.json()['forks_count'],
        		'stargazers':r.json()['stargazers_count'],
        	}
        	self.organisations_projects.append(data)


        if self.next_page[self.next_page.index('=')+1:] != self.lastpage:
            self.next_page=self.next_page[:self.next_page.index('=')+1] +str(int(self.next_page[self.next_page.index('=')+1:])+1)
            print "This is the next page", self.next_page
            next_url = response.urljoin(self.next_page)
            yield scrapy.Request(next_url, callback=self.parse)
        else:
        	yield{
       			r.json()['owner']['login']:self.organisations_projects
        	}