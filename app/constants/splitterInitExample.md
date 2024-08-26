### 창 정보(위치 등) 초기 세팅을 지정하고싶을 때

```JSON
// spliterInit.json
{
  "isVertical": false,
  "childs": [
    {
      "scale": 1,
      "address": "T9MpXTyzIVwUa5+tiSOmocjcZoFaLalU/T5ECjBAYG0=",
      "childs": [
        {
          "name": "red",
          "address": "kULuoK70AjEysBBRFYGm2MZqNsD0uPqxjp3Qvvnm/Bs="
        },
        {
          "name": "green",
          "address": "GWw4ow0TDe5s1G22y0LZ9JabNmOHzT9i/2UEqtcK7rs="
        },
        {
          "name": "blue",
          "address": "BEJWCv7+W2HgwYwnoR+lTemJIPUfU2KjcA0qM1vBoWU="
        }
      ],
      "selected": 2,
      "fold": false
    }
  ],
  "address": "bfcKiBdl6tFPuNSzdXTs3PeioBl6lszDJ0rAczs7C0c=",
  "scale": 1
}
```

### 창 정보(위치 등) 초기 세팅이 필요 없을 때

- 아래와 같은 경우, [boxList.ts](../boxes/boxList.ts)에 지정한 모든 창(error 컴포넌트 제외)이 같은 탭으로 배치됩니다.

```JSON
// spliterInit.json
{}
```
