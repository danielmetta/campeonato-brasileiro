#Módulo Web Scrap para consulta de jogos do campeonato brasileiro

[![npm](https://img.shields.io/npm/v/campeonato-brasileiro.svg)](https://www.npmjs.com/package/campeonato-brasileiro)
[![npm](https://img.shields.io/npm/dm/campeonato-brasileiro.svg)](https://www.npmjs.com/package/campeonato-brasileiro)

O **campeonato-brasileiro** é um módulo para consultar todos os jogos do campeonato brasileiro

O módulo retorna as informações dos jogos do campeonato brasileiro escolhido.

**npm install campeonato-brasileiro --save**

## Exemplo prático

```js

var cb = require('campeonato-brasileiro');

var ano = 2016;
var serie = 'a';

cb.consult(ano, serie).then(function(tabela) {
	console.log(tabela);
}, function(err){
	console.log(err);
});
```

### Objeto de Retorno

```js
[{
	rodada: "2",
	data: "22/05",
	horario: "16:00",
	dia: "Dom",
	mandante: "São Paulo",
	visitante: "Internacional",
	mandantePlacar: "1",
	visitantePlacar: "2",
	estadio: "Morumbi",
	cidade: "São Paulo",
	transmisao: [
		"Tv Aberta",
		"PFC"
	]
}]
```

### Objeto de erro

```js
{ error: 'Não foi possível retornar as informações!' }
```
