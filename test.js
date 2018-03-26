const templater = require('./index')

test('Book information #1', (done) => {
  const data = {
    store: {
      book: [
        {
          category: 'reference',
          author: 'Nigel Rees',
          title: 'Sayings of the Century',
          price: 8.95,
        }, {
          category: 'fiction',
          author: 'Evelyn Waugh',
          title: 'Sword of Honour',
          price: 12.99,
        }, {
          category: 'fiction',
          author: 'Herman Melville',
          title: 'Moby Dick',
          isbn: '0-553-21311-3',
          price: 8.99,
        }, {
          category: 'fiction',
          author: 'J. R. R. Tolkien',
          title: 'The Lord of the Rings',
          isbn: '0-395-19395-8',
          price: 22.99,
        },
      ],
      address: 'The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. ',
    },
  }

  const rules = [
    {
      xpath: '$..author',
      save: 'author',
    },
    {
      xpath: '$..title',
      save: 'title',
    },
    {
      xpath: '$.store.address',
      save: 'address',
    },
    {
      xpath: '$.store.book[*].isbn',
      save: 'isbn',
    },
    {
      xpath: '$..price',
      save: 'price',
    },
  ]

  const template = '{{~}}'

  templater
    .convert(template, rules, data)
    .then((result) => {
      console.log(JSON.stringify(result))
      expect(result.length).toBe(4)
      expect(result[0].isbn).toBeNull()
      expect(result[3].isbn).not.toBeNull()
      done()
    })
})

test('Book information #2', (done) => {
  const data = {
    store: {
      book: [
        {
          category: 'reference',
          author: 'Nigel Rees',
          title: 'Sayings of the Century',
          price: 8.95,
        }, {
          category: 'fiction',
          author: 'Evelyn Waugh',
          title: 'Sword of Honour',
          price: 12.99,
        }, {
          category: 'fiction',
          author: 'Herman Melville',
          title: 'Moby Dick',
          isbn: '0-553-21311-3',
          price: 8.99,
        }, {
          category: 'fiction',
          author: 'J. R. R. Tolkien',
          title: 'The Lord of the Rings',
          isbn: '0-395-19395-8',
          price: 22.99,
        },
      ],
      address: 'The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. ',
    },
  }

  const rules = [
    {
      xpath: '$..author',
      save: 'author',
    },
    {
      xpath: '$..title',
      save: 'title',
    },
    {
      xpath: '$.store.address',
      save: 'address',
    },
    {
      xpath: '$.store.book[*].isbn',
      save: 'isbn',
    },
    {
      xpath: '$..price',
      save: 'price',
    },
  ]

  const template = {
    public: '{{title}} by "{{author}}", only for USD {{price}}',
    library: '{{address}}',
  }

  templater
    .convert(template, rules, data)
    .then((result) => {
      console.log(JSON.stringify(result))
      expect(result.length).toBe(4)
      done()
    })
})

test('Book information #3', (done) => {
  const data = {
    store: {
      book: [
        {
          category: 'reference',
          author: 'Nigel Rees',
          title: 'Sayings of the Century',
          price: 8.95,
        }, {
          category: 'fiction',
          author: 'Evelyn Waugh',
          title: 'Sword of Honour',
          price: 12.99,
        }, {
          category: 'fiction',
          author: 'Herman Melville',
          title: 'Moby Dick',
          isbn: '0-553-21311-3',
          price: 8.99,
        }, {
          category: 'fiction',
          author: 'J. R. R. Tolkien',
          title: 'The Lord of the Rings',
          isbn: '0-395-19395-8',
          price: 22.99,
        },
      ],
      address: 'The Main Library is located on West Circle Drive, south of Grand River Avenue in East Lansing. ',
    },
  }

  const rules = [
    {
      xpath: '$..author',
      save: 'author',
    },
    {
      xpath: '$..title',
      save: 'title',
    },
    {
      xpath: '$.store.address',
      save: 'address',
    },
    {
      xpath: '$.store.book[*].isbn',
      save: 'isbn',
    },
    {
      xpath: '$..price',
      save: 'price',
    },
  ]

  const template = {
    type: 'e-book',
    shipping: true,
    available: true,
    information: '{{~}}',
  }

  templater
    .convert(template, rules, data)
    .then((result) => {
      console.log(JSON.stringify(result))
      expect(result.length).toBe(4)
      done()
    })
})

test('Facebook Payload Information', (done) => {
  const data = {
    object: 'page',
    test: 'kike',
    entry: [
      {
        id: '<PAGE_ID1>',
        time: 1458692752478,
        messaging: [
          {
            message: {
              mid: 'mid.1457764197618:41d102a3e1ae206a38',
              text: 'hello, world!',
            },
            recipient: {
              id: '<PAGE_ID>',
            },
            sender: {
              id: '<PSID>',
            },
            timestamp: 1458692752478,
          },
          {
            message: {
              mid: 'mid#2',
              text: 'text#2',
            },
            recipient: {
              id: 'recipient#2',
            },
            sender: {
              id: 'sender#2',
            },
            timestamp: 2,
          },
        ],
      },
      {
        id: '<PAGE_ID2>',
        time: 14586927524780000,
        messaging: [],
      },
      {
        id: '<PAGE_ID3>',
        time: 14586927524780000,
        messaging: [
          {
            message: {
              mid: 'mid.1457764197618:41d102a3e1ae206a38',
              text: 'hello, world! 3',
            },
            recipient: {
              id: '<PAGE_ID>',
            },
            sender: {
              id: '<PSID>',
            },
            timestamp: 1458692752478,
          },
          {
            message: {
              mid: 'mid#2',
              text: 'text#2ddd',
            },
            recipient: {
              id: 'recipient#2',
            },
            sender: {
              id: 'sender#2',
            },
            timestamp: 2,
          },
        ],
      },
    ],
  }

  const rules = [
    {
      xpath: '$.object',
      save: 'type',
    },
    {
      xpath: '$.entry[*].id',
      save: 'pageId',
    },
    {
      xpath: '$.test',
      save: 'type2',
    },
    {
      xpath: '$.entry[*].messaging[*].message.text',
      save: 'message',
    },
    {
      xpath: '$.entry[*].messaging[*].message.mid',
      save: 'mid',
    },
    {
      xpath: '$.entry[*].messaging[*].sender.id',
      save: 'senderId',
    },
    {
      xpath: '$.entry[*].time',
      save: 'pageTime',
    },
  ]

  const template = {
    data: {
      date: '{{pageTime}}',
      message: '{{message}}',
      type: 'text-message',
    },
    database: {
      id: '{{mid}}',
      pageId: '{{pageId}}',
    },
    user: {
      id: '{{senderId}}',
    },
    analyze: true,
    normalizer: '{{~}}',
    // raw: '{{$}}',
  }

  templater
    .convert(template, rules, data)
    .then((result) => {
      console.log(JSON.stringify(result))
      expect(result.length).toBe(5)
      expect(result[0].data.message).toEqual('hello, world!')
      expect(result[2].data.message).toBeNull()
      expect(result[4].database.id).toEqual('mid#2')
      done()
    })
})

