(function(){
    angular.module('pokedex.services',[])
        .factory('Pokemons',Pokemons)
        .factory('Historico', Historico)
        .constant('PokeapiURL','https://pokeapi.co/api/v1/');


    Pokemons.$inject = ['$http', '$q', 'PokeapiURL'];
    function Pokemons($http, $q, PokeapiURL){
        var service = {
            getAll: getAll,
            get: get
        }

        return service;

        function get(id){
            var defered = $q.defer();
            var url = PokeapiURL + '/pokemon/'+id;
            $http.get(url, {cache: true})
                .success(function(response){
                    var evolutions = response.evolutions;
                    var seenEvolutions = {};
                    evolutions = evolutions.filter(function(evo){
                        return seenEvolutions.hasOwnProperty(evo.to) ? false : (seenEvolutions[evo.to] = true);
                    });
                    response.evolutions = evolutions.map(buildPokemon);
                    defered.resolve(buildPokemon(response))
                })
                .error(function(){
                    defered.reject([]);
                });
            return defered.promise;
        }

        function buildPokemon(pokemon){
            var partes = pokemon.resource_uri.split('/');
            var id = partes[partes.length - 2];
            pokemon.id = parseInt(id);
            var name = '';
            if(!pokemon.name){
                name = pokemon.to.toLowerCase();
            }else{
                name = pokemon.name.toLowerCase();
            }
            pokemon.img = "https://img.pokemondb.net/sprites/black-white/normal/"+name+".png"
            return pokemon;
        }

        function getAll(){
            var defered = $q.defer();
            var url = PokeapiURL + 'pokedex/1/';
            $http.get(url, {cache: true}).success(function(response){
                var pokemons = response.pokemon;
                pokemons = pokemons.map(buildPokemon);
                defered.resolve(pokemons);
            }).error(function(){
                defered.reject([]);
            });
            return defered.promise;
        }
    };

    Historico.$inject = ['$rootScope'];
    function Historico($rootScope){
        var service = {
            pushState: pushState,
            popState: popState,
            getHistorico: getHistorico,
            clear: clear
        }

        var historico = [];
        if(localStorage.historico){
            historico = JSON.parse(localStorage.historico);
        }

        return service;

        function pushState(name){
            var state = window.location.hash;
            var atual = estadoAtual();
            if(!atual || atual.state !== state){
                historico.push({name: name, state: state});
                salvar();
            }
        }

        function estadoAtual(){
            return historico[historico.length-1];
        }

        function popState(steps){
            for (var i = steps; i >= 0; i--) {
                historico.pop()
            }
            salvar();
        }

        function clear(){
            historico = [];
            salvar();
        }

        function salvar(){
            localStorage.setItem('historico', JSON.stringify(historico));
            $rootScope.$emit('historico.changed');
        }

        function getHistorico(){
            return angular.copy(historico);
        }

    }
})();
