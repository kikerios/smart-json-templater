# 💪 Smart Json Templater 👌

### template.json
```
{
    "data": {
		"date": "{{pageTime}}",
		"message": "{{facebookMessage.message.text}}",
		"type": "text-message"
	},
	"database": {
		"id": "{{facebookMessage.message.mid}}"
	},
	"user": {
		"id": "{{facebookMessage.message.sender.id}}"
	},
	"analyze": true,
	"raw": "{{raw}}"
}
```
### rules.json
```
[
	{
		'root': '/',
		'path': 'object',
		'save': 'webhookType'
	},
	{
		'root': '/',
		'path': 'entry',
		'rules': [
			{
				'root': '/',
				'path': 'id',
				'save': 'pageId'
			},
			{
				'root': '/',
				'path': 'time',
				'save': 'pageTime'
			},
			{
				'root': '/',
				'path': 'messaging',
				'rules': [
					{
						'root': '/',
						'save': 'facebookMessage',
						'end': true
					}
				]
			}
		]
	}
]
```
### raw.json
```
{
    "object":"page",
    "entry":[
        {
          "id":"<PAGE_ID>",
          "time":1458692752478,
          "messaging":[
            {
              "message":{
                "mid":"mid.1457764197618:41d102a3e1ae206a38",
                "text":"hello, world!"
              },
              "recipient":{
                "id":"<PAGE_ID>"
              },
              "sender":{
                "id":"<PSID>"
              },
              "timestamp":1458692752478
            },
            {
              "message":{
                "mid":"mid#2",
                "text":"text#2"
              },
              "recipient":{
                "id":"recipient#2"
              },
              "sender":{
                "id":"sender#2"
              },
              "timestamp":2
            }
          ]
        }
    ]
}
```
### install
`npm i smart-json-templater --save`

### example
```
const templater = require('smart-json-templater')

// example data
const template = require('./template.json')
const rules = require('./rules.json')
const raw = require('./raw.json')

templater.convert(template, rules, raw)
    .then((result)=>{
        console.log(result)
    })
```
### result
    [
      {
        "data":{
          "date":"1458692752478",
          "message":"hello, world!",
          "type":"text-message"
        },
        "database":{
          "id":"mid.1457764197618:41d102a3e1ae206a38"
        },
        "user":{
          "id":"<PSID>"
        },
        "analyze":true
      },
      {
        "data":{
          "date":"1458692752478",
          "message":"text#2",
          "type":"text-message"
        },
        "database":{
          "id":"mid#2"
        },
        "user":{
          "id":"sender#2"
        },
        "analyze":true
      }
    ]
with ❤ by [@kikerios](https://github.com/kikerios)
