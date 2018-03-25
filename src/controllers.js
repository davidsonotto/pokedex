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
            Pokemons.getAll().then(function(pokemons){
                $scope.pokemons = pokemons;
            },function(){
                $scope.pokemons = [];
            });
        }

})();
