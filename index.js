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

            const teste = /const classificacao = (.*?);\n/gmi;
           //teste.compile();
            var g = teste.exec(html);
            if (g){
                if (g[1]) {
                    const jsonCampeonato = JSON.parse(g[1]);
                    const classificacao = jsonCampeonato.classificacao;
                    var lista = [];
                    classificacao.forEach(time => {
                        lista.push({
                            nome : time.nome_popular,
                            pontos : time.pontos,
                            jogos : time.jogos,
                            vitorias : time.vitorias,
                            empates : time.empates,
                            derrotas : time.derrotas,
                            golsPro : time.gols_pro,
                            golsContra : time.gols_contra,
                            saldoGols : time.saldo_gols,
                            percentual : time.aproveitamento
                        })
                    });
                    acept(lista);
                }
            }
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
