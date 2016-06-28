# Módulo Web Scrap para consulta de jogos, tabela e rodadas do campeonato brasileiro

[![npm](https://img.shields.io/npm/v/campeonato-brasileiro.svg)](https://www.npmjs.com/package/campeonato-brasileiro)
[![npm](https://img.shields.io/npm/dm/campeonato-brasileiro.svg)](https://www.npmjs.com/package/campeonato-brasileiro)

O **campeonato-brasileiro** é um módulo para consultar todos os jogos, tabela e rodadas do campeonato brasileiro

O módulo retorna as informações dos jogos, tabela e rodadas do campeonato brasileiro escolhido.

**npm install campeonato-brasileiro --save**

## Exemplo prático - Jogos

```js

var cb = require('campeonato-brasileiro');

var ano = 2016;
var serie = 'a';

cb.jogos(ano, serie).then(function(jogos) {
	console.log(jogos);
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


## Exemplo prático - Tabela

```js

var cb = require('campeonato-brasileiro');

var serie = 'a';

cb.tabela(serie).then(function(tabela) {
	console.log(tabela);
}, function(err){
	console.log(err);
});
```

### Objeto de Retorno

```js
[{
	nome: "Atlético",
	pontos: "10",
	jogos: "5",
	vitorias: "2",
	empates: "2",
	derrotas: "1",
	golsPro: "10",
	golsContra: "4",
	saldoGols: "6",
	percentual: "66.3"
}]
```

### Objeto de erro

```js
{ error: 'Não foi possível retornar as informações!' }
```

## Exemplo prático - Rodada Atual

```js

var cb = require('campeonato-brasileiro');

var serie = 'a';

cb.rodadaAtual(serie).then(function(rodada) {
	console.log(rodada);
}, function(err){
	console.log(err);
});
```

### Objeto de Retorno

```js
[{
	 mandante: 'América-MG',
	 placarMandante: 0,
	 visitante: 'Corinthians',
	 placarVisitante: 0
 }]
```

### Objeto de erro

```js
{ error: 'Não foi possível retornar as informações!' }
```
