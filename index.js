'use strict';
require('es6-promise').polyfill();
var request = require('request')
var cheerio = require('cheerio');

exports.jogos = function(ano, serie) {
  return new Promise(function(acept, error) {
    var options = {
      url: 'http://www.tabeladobrasileirao.net/' + ano + '/serie-' + serie,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
      }
    };
    request(options, function(error, response, html) {
      if(!error) {

        var $ = cheerio.load(html);
        var lista = [];

        $('#jogos tbody tr').each(function() {
          var item = $(this);
          var produto = {};
          produto.rodada = item.find('.rd').text().replace('a ', ' ').replace('rodada', '').trim();
          produto.data = item.find('.rd').next().text();
          produto.horario = item.find('.rd').next().next().next().text();
          produto.dia = item.find('.rd').next().next().text();
          produto.mandante = item.find('.md .ttm').text();
          produto.visitante  = item.find('.vt .ttv').text();
          produto.mandantePlacar = item.find('.pm').text();
          produto.visitantePlacar = item.find('.pv').text();
          produto.estadio = item.find('.vt').next().text();
          produto.cidade = item.find('.vt').next().next().text();
          produto.transmisao = [];
          item.find('.vt').next().next().next().children('i').each(function(i) {
            var i = $(this);
            switch (i.attr('rel')) {
              case 'tva':
              produto.transmisao.push('Tv Aberta');
              break;
              case 'tvs':
              produto.transmisao.push('SportTV');
              break;
              case 'tvp':
              produto.transmisao.push('PFC');
              break;
              case 'tvi':
              produto.transmisao.push('Indefinida');
              break;
            }
          });
          lista.push(produto);
        });
        acept(lista);
      } else {
        error({ error:"Não foi possível retornar as informações!" });
      }
    });
  });
};

exports.tabela = function(serie) {
  return new Promise(function(acept, error) {
    var options = {
      url: 'http://globoesporte.globo.com/futebol/brasileirao-serie-' + serie,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
      }
    };
    request(options, function(error, response, html) {
      if(!error) {

        var $ = cheerio.load(html);
        var lista = [];

        $('.tabela-times tbody tr').each(function() {
          var item = $(this);
          var time = {};
          time.nome = item.find('.tabela-times-time-link').attr('title');
          lista.push(time);
        });
        var x = 0;
        $('.tabela-pontos tbody tr').each(function() {
          var item = $(this);
          lista[x].pontos = item.find('.tabela-pontos-ponto').text();
          lista[x].jogos = item.find('.tabela-pontos-ponto').next().text();
          lista[x].vitorias = item.find('.tabela-pontos-ponto').next().next().text();
          lista[x].empates = item.find('.tabela-pontos-ponto').next().next().next().text();
          lista[x].derrotas = item.find('.tabela-pontos-ponto').next().next().next().next().text();
          lista[x].golsPro = item.find('.tabela-pontos-ponto').next().next().next().next().next().text();
          lista[x].golsContra = item.find('.tabela-pontos-ponto').next().next().next().next().next().next().text();
          lista[x].saldoGols = item.find('.tabela-pontos-ponto').next().next().next().next().next().next().next().text();
          lista[x].percentual = item.find('.tabela-pontos-ponto').next().next().next().next().next().next().next().next().text();
          x++;
        });
        acept(lista);
      } else {
        error({ error:"Não foi possível retornar as informações!" });
      }
    });
  });
};

exports.rodadaAtual = function(serie) {
  return new Promise(function(acept, error) {
    var options = {
      url: 'http://globoesporte.globo.com/futebol/brasileirao-serie-' + serie,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
      }
    };
    request(options, function(error, response, html) {
      if(!error) {

        var $ = cheerio.load(html);
        var lista = [];

        $('.lista-de-jogos-conteudo li').each(function() {
          var rodada = {};
          var item = $(this);
          rodada.mandante = item.find('.placar-jogo-equipes').find('.placar-jogo-equipes-mandante').find('.placar-jogo-equipes-sigla').attr('title');
          rodada.placarMandante = item.find('.placar-jogo-equipes').find('.placar-jogo-equipes-placar').find('.placar-jogo-equipes-placar-mandante').text();
          rodada.visitante = item.find('.placar-jogo-equipes').find('.placar-jogo-equipes-visitante').find('.placar-jogo-equipes-sigla').attr('title');
          rodada.placarVisitante = item.find('.placar-jogo-equipes').find('.placar-jogo-equipes-placar').find('.placar-jogo-equipes-placar-visitante').text();
          if(!rodada.placarMandante) rodada.placarMandante = 0;
          if(!rodada.placarVisitante) rodada.placarVisitante = 0;
          lista.push(rodada);
        });
        acept(lista);
      } else {
        error({ error:"Não foi possível retornar as informações!" });
      }
    });
  });
};
