'use strict';
require('es6-promise').polyfill();
var request = require('request')
var cheerio = require('cheerio');

function ConsultaJogo(ano, serie) {
  return new Promise(function(acept, error) {
    var url = ''
    if(serie == 'a') {
      url = 'https://especiais.tribunapr.com.br/futebol/tabela-brasileirao-serie-2019/'
    } else {
      url = 'https://especiais.tribunapr.com.br/futebol/tabela-brasileirao-serie-b-2019/'
    }
    var options = {
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
      }
    };
    request(options, function(error, response, html) {
      if(!error) {

        var $ = cheerio.load(html);
        var lista = [];

        $('.rodada').each(function() {
          var item = $(this);
          var rodada = {}

          rodada.numero = item.attr('data-round');
          rodada.jogos = item.html();

          if(item.attr('data-round')) lista.push(rodada);
        });
        acept(lista);
      } else {
        error({ error:"Não foi possível retornar as informações!" });
      }
    });
  });
};



exports.jogos = function(ano, serie) {
  return new Promise(function(resolve, reject) {
    let lista = [];
    ConsultaJogo(ano, serie).then((value) => {

      var lista = [];
      value.map((item, i) => {

        var $ = cheerio.load(item.jogos);
        var jogo = {};
        $('table').each(function() {
          var html = $(this);
          jogo.rodada = item.numero;

          jogo.mandante = html.find('tbody tr').find('td').first().next().find('meta').first().attr('content');
          jogo.mandantePlacar = html.find('tbody tr').find('td').first().next().next().text();

          jogo.visitante = html.find('tbody tr').find('td').first().next().next().next().next().next().find('meta').first().attr('content');
          jogo.visitantePlacar = html.find('tbody tr').find('td').first().next().next().next().next().text();

          jogo.estadio = html.find('.data-jogo').find('span').first().next().text();

          var data = html.find('.data-jogo').find('span').first().text();
          if(data){
            var dados = data.replace('- ', '').split(' ');
            jogo.data = dados[1]
            jogo.hora = dados[2]
            jogo.dia = dados[0]
          } else {
            jogo.data = ''
            jogo.hora = ''
            jogo.dia = ''
          }
          jogo.cidade = '';
          jogo.transmisao = [];
          if(jogo.mandante)  lista.push(jogo);
          jogo = {}
        })

        if(value.length == i +1) {
          resolve(lista)
        }
      })
    }).catch((err) => {

    })
  });
}

exports.tabela = function(ano, serie) {
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
        $('.container-table .simulator-table .table tbody tr').each(function() {
          var item = $(this);
          var jogo = {};
          jogo.nome = item.find('.club-name--desktop').text().trim();
          jogo.abreviacao = item.find('.club-name--mobile').text().trim();
          jogo.pontos = parseInt(item.find('.points').text().trim());
          jogo.jogos = parseInt(item.find('.played').text().trim());
          jogo.vitorias = parseInt(item.find('.wins').text().trim());
          jogo.empates = parseInt(item.find('.draws').text().trim());
          jogo.derrotas = parseInt(item.find('.losses').text().trim());
          jogo.golsPro = parseInt(item.find('.goals_for').text().trim());
          jogo.golsContra = parseInt(item.find('.goals_against').text().trim());
          jogo.saldoGols = parseInt(item.find('.goals_diff').text().trim());
          jogo.aproveitamento = parseInt(item.find('.percent').text().trim());
          lista.push(jogo);
        });
        acept(lista);
      } else {
        error({ error:"Não foi possível retornar as informações!" });
      }
    });
  });
};


exports.rodadaAtual = function(ano, serie) {
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
        // console.log($.html());;
        $('.container-table .simulator-games .table tbody tr').each(function() {
          var rodada = {};
          var item = $(this);
          if(!item.attr('hidden')) {
            // console.log(item.attr('hidden'));
            rodada.rodada = item.attr('data-round');
            var dateS = item.find('.game-date').text().split(' - ');
            if(dateS.length > 0) {
              rodada.data = dateS[1].trim();
              rodada.horario = dateS[2].trim();
              rodada.dia = dateS[0].trim();
            } else {
              rodada.data = '';
              rodada.horario = '';
              rodada.dia = '';
            }
            rodada.mandante = item.find('.game-club--principal').attr('title').trim();
            rodada.placarMandante = item.find('div.game-scoreboard-values').children().first().text().trim();
            rodada.visitante  = item.find('.game-club--visitor').attr('title').trim();
            rodada.placarVisitante = item.find('div.game-scoreboard-values').children().last().text().trim();
            rodada.estadio = item.find('.game-location').text().trim();
            if(!rodada.placarMandante) rodada.placarMandante = 0;
            if(!rodada.placarVisitante) rodada.placarVisitante = 0;
            lista.push(rodada);
          }

        });
        acept(lista);
      } else {
        error({ error:"Não foi possível retornar as informações!" });
      }
    });
  });
};
