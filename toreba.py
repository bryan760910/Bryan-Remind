import requests
import json
import webbrowser
import time

r = requests.get('https://www.toreba.net/ajax_api/get_machine_state/')
t = json.loads(r.text)
toreba_list = t.get("data")

canlist = []
for items in toreba_list:
    if toreba_list[items].get("waiter_num") == 1 and toreba_list[items].get(
            "connector_num") < 5 and toreba_list[items].get("isFreePlayTicket") == True:
        canlist.append(items)

for url in canlist:
    print('https://www.toreba.net/play/webapp/' + url)
    webbrowser.open('http://google.co.kr', new=2)
    time.sleep(5)
