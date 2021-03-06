(function(){
    angular.module('pokedex.controllers',[])
        .controller('PokemonsController', PokemonsController)
        .controller('PokemonDetailController', PokemonDetailController)
        .controller('MovesController', MovesController);

        PokemonsController.$inject = ['$scope', 'Pokemons', 'Historico'];
        function PokemonsController($scope, Pokemons, Historico){
            Historico.clear();

            $scope.pokemons = [];
            $scope.carregando = true;
            Pokemons.getPokemons().then(function(pokemons){
                $scope.pokemons = pokemons;
                $scope.carregando = false;
            },function(){
                $scope.pokemons = [];
                $scope.carregando = false;
            });
        }

        PokemonDetailController.$inject = ['$scope', '$state', 'Pokemons', 'Historico'];
        function PokemonDetailController($scope, $state, Pokemons, Historico){
            var pokeId = $state.params.id;

            $scope.$state = $state;

            $scope.pokemon = {};
            Pokemons.get(pokeId).then(function(pokemon){
                $scope.pokemon = pokemon;
                Historico.pushState(pokemon.name)
            },function(){
                $scope.pokemon = {};
            });
        }
})();
