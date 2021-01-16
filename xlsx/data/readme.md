# required
- json-server [json-server document](https://www.npmjs.com/package/json-server)
- REST Client(vs code) [REST Client (vs code)](https://gist.github.com/shimdh/4e2e3457fd316372311c6d789ccc5ffa)
```bash
npm install json-server -g
```

# bash
```bash
json-server --watch db.json
```

# sim table scheme example
```json
{
    "id": "2018061680631401",
    "구매자명": "최유정",
    "구매자ID": "chld****",
    "수취인명": "최유정",
    "주문상태": "발송대기",
    "옵션정보1": "7/8 13시",
    "옵션정보2": "7/12 03시 /",
    "옵션정보3": "다낭 / 베트남 유심: 데이터 5GB / 현지무료통화 100분 / 사용기간 5일",
    "수량": "2",
    "수취인연락처1": "010-3745-2428",
    "수취인연락처2": "010-3745-2428",
    "배송지": "서울특별시 송파구 올림픽로 135 (잠실동, 리센츠) 264동1901호",
    "구매자연락처": "010-3745-2428",
    "우편번호": "05502",
    "배송메세지": "부재시 양수기함에 넣어주세요"
}
```