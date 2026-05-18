# randex

Generates random filename, username, email, name, full name, etc for test purposes.

<a href="https://www.npmjs.com/package/randex">
    <img src="https://nodei.co/npm/randex.png?mini=true">
</a>

## Usage

Installation:

```js
npm i randex
```

Strings:

- [random](#random)
- [word](#word)
- [fileName](#filename)
- [username](#username)
- [email](#email)
- [singleName](#singlename)
- [fullName](#fullname)
- [phrase](#phrase)
- [sentence](#sentence)

Numbers:
- [number](#number)

Many
- [many](#many)


Generic Type:
- [array](#array)

Deeps:

- [Customization](#customization)
- [Types](#types)

## random

Basic function to construct random things.

```ts
import Randex from "randex";

// 3 english chars
Randex.random({
  set: "english",
  length: 3,
});
// or short:
Randex.random(["english", 3]);
// EFd

// 3 lower english chars
Randex.random({
  set: ["english", "lower"],
  length: 3,
});
// or short:
Randex.random([["english", "lower"], 3]);
// yhl

// min 1 and max 3 english chars
Randex.random({
  set: "english",
  length: [1, 3],
});
// or short:
Randex.random(["english", [1, 3]]);
// eR

// 3 number chars
Randex.random({
  set: "number",
  length: 3,
});
// or short:
Randex.random(["number", 3]);
// 643

// 3 chars from custom char range
Randex.random({
  charRange: "abc123",
  length: 3,
});
// a21

// 3 english or number chars
Randex.random({
  set: ["english", "number"],
  length: 3,
});
// or short:
Randex.random([["english", "number"], 3]);
// x4d

// 4 chars: 2 english and 2 english or number
Randex.random(
  {
    set: "english",
    length: 2,
  },
  {
    set: ["english", "number"],
    length: 2,
  }
);
// or short:
Randex.random(["english", 2], [["english", "number"], 2]);
// Kb3b
```

Options:
| Name | Type| Description|
| ------------------------ | ---- |------------ |
|set|[RandexSet](#randexset) | Defined chars|
|charRange|`string`| Range or custom chars |
|length|[RandexNumberRange](#randexnumberrange) | Length of chars |

## word

Randoms a simple word.

```ts
import Randex from "randex";

// default
Randex.word();
// kpmld

// with length 5 chars
Randex.word({ length: 5 });
// or short:
Randex.word(5);
// imphs

// with 2 min and 5 max chars
Randex.word({ length: [2, 5] });
// or short:
Randex.word([2, 5]);
// kslg

// name from french alphabet
Randex.word({ alphabet: "french" });
// or short:
Randex.word("french");
// dbïœ

// name from french alphabet with length
Randex.word({ alphabet: "french", length: 10 });
// or short:
Randex.word("french", 10);
// rsîrjhjôôw
```

Options:
| Name | Type| Description|
| ------------------------ | ---- |------------ |
|length|[RandexNumberRange](#randexnumberrange) | Length of chars. Default: [2,10] |
|alphabet|[RandexAlphabet](#randexalphabet) | Defined alphabet. Default: `english` |

## fileName

Randoms file name.

```ts
import Randex from "randex";

// default
Randex.fileName({
  extension: "txt",
});
// td1TX31eOB.txt

// defined extension
Randex.fileName({
  extension: "txt",
});
// or short:
Randex.fileName("txt");
// HkmOjqHC6.txt

// defined file name length and extension length
Randex.fileName({
  fileNameLength: [7, 10],
  extensionLength: 5,
});
// or short:
Randex.fileName([7, 10], 5);
// 1SJVkHSBjq.tejuw

// defined file name length and extension
Randex.fileName({
  fileNameLength: 8,
  extension: "xml",
});
// or short:
Randex.fileName(8, "xml");
// JyCsuN5kD.xml
```

Options:
| Name | Type| Description|
| ------------------------ | ---- |------------ |
|fileNameLength|[RandexNumberRange](#randexnumberrange) | Length of file name (not including extension). Default: [3,10] |
|extensionLength|[RandexNumberRange](#randexnumberrange) | Length of extension (not including file name) chars. Default: [2,5] |
|extension| `string`| File extension. |

## username

Randoms username.

```ts
import Randex from "randex";

// default
Randex.username();
// icvv81d1j

// with length 5 chars
Randex.username({ length: 5 });
// or short:
Randex.username(5);
// okmle

// with 2 min and 5 max chars
Randex.singleName({ length: [2, 5] });
// or short:
Randex.username([2, 5]);
// lkhs
```

Options:
| Name | Type| Description|
| ------------------------ | ---- |------------ |
|length|[RandexNumberRange](#randexnumberrange) | Length of chars. Default: [6,10] |

## email

Randoms an email.

```ts
import { randomEmail } from "randex";

// default
randomEmail();
// stv4ox27sevt@mqsyin.fil

// defined prefix length
randomEmail({
  prefixLength: 8,
});
// or shot:
randomEmail(8);
// epzn3hbz@vu.xsp

// defined prefix, low domain and hight domain length
randomEmail({
  prefixLength: 8,
  lowDomainLength: 4,
  hightDomainLength: 2,
});
// or shot:
randomEmail(8, 4, 2);
// 8p0bjoua@fcsa.gr

// defined domain
randomEmail({
  domain: "test.com",
});
// or shot:
randomEmail("test.com");
// efnmo1r5@test.com
```

Options:
| Name | Type| Description|
| ------------------------ | ---- |------------ |
|prefixLength|[RandexNumberRange](#randexnumberrange) | Length of email prefix (chars before `@`). Default: [6, 10] |
|hightDomainLength|[RandexNumberRange](#randexnumberrange) | Length of hight domain part (example: test.<b>com</b>). Default: [1,6] |
|lowDomainLength|[RandexNumberRange](#randexnumberrange) | Length of low domain part (example: <b>test</b>.com). Default: [4,2] |
|domain| `string`| Defined domain. |

## singleName

Randoms a name of the person, city, place, restaurant, ect.

```ts
import Randex from "randex";

// default
Randex.singleName();
// Ijb

// with length 5 chars
Randex.singleName({ length: 5 });
// or short:
Randex.singleName(5);
// Okmpj

// with 2 min and 5 max chars
Randex.singleName({ length: [2, 5] });
// or short:
Randex.singleName([2, 5]);
// Wslg

// name from french alphabet
Randex.singleName({ alphabet: "french" });
// or short:
Randex.singleName("french");
// Dbïœ

// name from french alphabet with length
Randex.singleName({ alphabet: "french", length: 10 });
// or short:
Randex.singleName("french", 10);
// Rsîrjhjôôw
```

Options:
| Name | Type| Description|
| ------------------------ | ---- |------------ |
|length|[RandexNumberRange](#randexnumberrange) | Length of chars. Default: [2,10] |
|alphabet|[RandexAlphabet](#randexalphabet) | Defined alphabet. Default: `english` |

## fullName

Randoms a full name of the person.

```ts
import Randex from "randex";

// default
Randex.fullName();
// Eqaa Bfmotnq
```

Options:
| Name | Type| Description|
| ------------------------ | ---- |------------ |
|firstLength|[RandexNumberRange](#randexnumberrange) | First name length of chars. Default: [2, 10] |
|secondLength|[RandexNumberRange](#randexnumberrange) | Second name length of chars. Default: [2,10] |
|alphabet|[RandexAlphabet](#randexalphabet) | Defined alphabet. Default: `english` |

## phrase

Randoms a phrase.

```ts
import Randex from "randex";

// default word range is from 2 to 9
Randex.phrase();
// te vdancy poluwsd sswl aqxq

// with 5 words
Randex.v({ words: 5 });
// or:
Randex.sentence(5);
// wyfb hnhtl ptn shemiukme poyyjtr

// with words range
Randex.sentence({ words: [3, 6] });
// or:
Randex.sentence([3, 6]);
// nfob xcwg tmhfu hiqonw

// with french alphabet
Randex.sentence({ alphabet: "french" });
// or:
Randex.sentence("french");
// æeâoô déèbfûûæ aôç udôûsèqpa ygyïœùuè oê
```

Options:
| Name | Type| Description|
| ------------------------ | ---- |------------ |
|words|[RandexNumberRange](#randexnumberrange) | A number or range of words. Default: [2,9] |
|alphabet|[RandexAlphabet](#randexalphabet) | Defined alphabet. Default: `english` |


## sentence

Randoms a sentence.

```ts
import Randex from "randex";

// default word range is from 3 to 15
Randex.sentence();
// Gpgowb te vdancy poluwsd sswl aqxq.

// with 5 words
Randex.sentence({ words: 5 });
// or:
Randex.sentence(5);
// Xja wyfbhnhtl ptn shemiukme poyyjtr.

// with words range
Randex.sentence({ words: [3, 6] });
// or:
Randex.sentence([3, 6]);
// Vg nfobxcwg tmhfu hiqonw.

// with french alphabet
Randex.sentence({ alphabet: "french" });
// or:
Randex.sentence("french");
// Êid æeâoô déèbfûûæ aôç udôûsèqpa ygyïœùuè oê rmânacgwnc kuàq qêœççzœx iolîœsqàu aùàrpëhuâh rèèfhmæ klltu.
```

Options:
| Name | Type| Description|
| ------------------------ | ---- |------------ |
|words|[RandexNumberRange](#randexnumberrange) | A number or range of words. Default: [3,15] |
|alphabet|[RandexAlphabet](#randexalphabet) | Defined alphabet. Default: `english` |


## number

Generates random number from a range of numbers.

```ts
import Randex from "randex";

// Generates a number from a range: [0, 3] (includes 0 and 3).
Randex.number(3);

// Generates a number from a specified range: [3, 7].
Randex.number([3, 7]);
```

Options:
| Name | Type| Description|
| ------------------------ | ---- |------------ |
|decimals| `number` | Number of decimal digits |

## many

Generates many defined random methods.

```ts
import Randex from "randex";

// Generates three words with english alphabet.
Randex.many(3).word("english");

// Generates seven phrases with english alphabet.
Randex.many(7).phrase("english");

// Generates five sentences with french alphabet.
Randex.many(5).sentence("french");

// Generates an array with length from 2 to 4 of random numbers from 3 to 7.
Randex.many([2, 4]).number([3, 7]);
```

## array

Generates random array with values from defined array.

```ts
import Randex from "randex";

// Generates an array (with length equals 2) with values picked from defined array as the first parameter.
Randex.array([1, 2, 3, 4], 2);
// [2, 4]
Randex.array(["1", "2", "3", "4"], 2);
// ["1", "3"]
```


## Customization

[random](#random) function is very flexible, there are many custom functions can be created.

There are examples how to create custom function for most common cases:

<b>Randex.fileName</b>

```ts
Randex.random([
  ["english", "number"],
  [3, 10],
]) +
  "." +
  Randex.random([
    ["english", "l"],
    [2, 5],
  ]);
```

<b>Randex.username</b>

```ts
Randex.random(
  ["english", "l"],
  [
    [["english", "l"], "number"],
    [5, 10],
  ]
);
```

<b>Randex.email</b>

```ts
Randex.random([
  [["english", "l"], "number"],
  [6, 10],
]) +
  "@" +
  Randex.random([
    ["english", "l"],
    [2, 4],
  ]) +
  "." +
  Randex.random([
    ["english", "l"],
    [1, 6],
  ]);
```

<b>Randex.singleName</b>

```ts
Randex.random(
  ["english", "u"],
  [
    ["english", "l"],
    [1, 10],
  ]
);
```

<b>Randex.fullName</b>

```ts
Randex.random(
  ["english", "u"],
  [
    ["english", "l"],
    [1, 10],
  ]
) +
  " " +
  Randex.random(
    ["english", "u"],
    [
      ["english", "l"],
      [1, 10],
    ]
  );
```

## Types

### RandexNumberRange

Possible types:

`number`: strict number

`[number, number]`: an array of min and max numbers.

Example:

```ts
Randex.random({ set: "bit", length: 5 });
Randex.random({ set: "bit", length: [5, 10] });
// or short:
Randex.random(["bit", 5]);
Randex.random(["bit", [5, 10]]);
```

### RandexSet

Possible types:

`string`: an alphabet - [RandexAlphabet](#randexalphabet) or a set of chars - [RandexKit](#randexkit)

`[string, string]`: the first item is - [RandexAlphabet](#randexalphabet), the second item is - [RandexCase](#randexcase)

Example:

```ts
Randex.random({ set: "bit" });
Randex.random({ set: "spanish" });
Randex.random({ set: ["spanish", "lower"] });
// or short:
Randex.random("bit");
Randex.random("spanish");
Randex.random(["spanish", "l"]);
```

### RandexAlphabet

An alphabet of chars

`string` values: `english`, `french`, `spanish`, `russian`.

Example:

```ts
Randex.random({ set: "spanish" });
// or short:
Randex.random("spanish");
```

### RandexKit

A kit of chars

`string` values: `hex`, `symbol`, `number`, `binary`.

Example:

```ts
Randex.random({ set: "hex" });
// or short:
Randex.random("hex");
```

### RandexCase

A case of alphabet

`string` values: `upper`, `u`,`lower`, `l`.

Example:

```ts
Randex.random({ set: ["spanish", "lower"] });
// or short:
Randex.random(["spanish", "l"]);
```
