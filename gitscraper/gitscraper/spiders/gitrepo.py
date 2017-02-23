import scrapy
import requests

class gitrepo(scrapy.Spider):
    name = "gitrepo"
    start_urls = [
        'https://github.com/trending?since=monthly',
    ]
    repo_api_url='https://api.github.com/repos'
    trending=[]

    def parse(self, response):
        titles=response.css("ol.repo-list div.d-inline-block h3 a::attr(href)").extract()
        for ele in titles:
            titles[titles.index(ele)]= ele.encode('ascii','ignore').strip() 
        for ele in titles:
        	data={}
        	current_repo_url=self.repo_api_url+ele+'?access_token=71f84b49362fd5336913573c94b45aaf98a6f84c'
        	r=requests.get(current_repo_url)
        	data={
        		'owner_type':r.json()['owner']['type'],
        		'owner_name':r.json()['owner']['login'],
        		'project_id':r.json()['id'],
        		'project_name':r.json()['name'],
        		'project_description':r.json()['description'],
        		'forks_count':r.json()['forks_count'],
        		'stargazers':r.json()['stargazers_count'],
        		'language':r.json()['language']
        	}
        	self.trending.append(data)
        yield{
        'monthly':self.trending
        }