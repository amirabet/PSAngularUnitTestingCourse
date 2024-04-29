import { of } from "rxjs";
import { HeroesComponent } from "./heroes.component"

describe('Heroes Component', () => {
  let component: HeroesComponent;
  let HEROES; // Property of HeroesComponent => heroes: Hero[];
  let mockHeroService;

  beforeEach(() => {
    // Fill some values
    HEROES = [
      { id: 1, name: 'Spider Boy', strength: 8 },
      { id: 2, name: 'Wonderful Lady', strength: 24 },
      { id: 3, name: 'Super Dude', strength: 55 },
    ];

    /*
    * A Fake HeroService that has an array of methods
    * as parameter of it's createSpyObj() method
    * that will be used in the testing 
    */
    mockHeroService = jasmine.createSpyObj([
      'getHeroes', 'addHero', 'deleteHero'
    ])

    /*
    * The component needs the HeroesService in the constructor,
    * but we don't want to use the ral HeroService because:
    * 1/ We only want oto test one unit: the component.
    * 2/ It performs an http call, and this is ut of Unit Test scope.
    * 
    * So we need to make our Fake HeroesService using mocking
    */
    component = new HeroesComponent(mockHeroService);
  })

  // Now we can try 'Delete' method
  // Notice that is Inside first describe('Heroes Component') 
  describe('delete', () => {
    it('should remove the indicated hero from heroes list', () => {
      /*
      * Because delete retuns and observable: this.heroService.deleteHero(hero).subscribe();
      * we can simulate it by adding another return value with .and. operator
      * This retured value will be an observable ("of" from RxJS) that creates the observable
      */
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(component.heroes.length).toBe(2);

      /*
      * Notice that this test doesn't check if 
      * third hero 'Super Dude' still in the HEROES array
      */
    })

    /*
    * Making an Interaction test:
    * we'll check actions between HeroCompoente and HeroService
    */
    it('should call deleteHero with the correct hero', () => {
      /*
      * REMEMBER: don't worry for code duplication:
      * each test explains its own story
      */
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      /*
      * toHaveBeenCalled() method ensures that we call the method that's the parameter from the expect
      * toHaveBeenCalledWith({}) let us specifiy the parameter of this call
      */
      expect(mockHeroService.deleteHero).toHaveBeenCalled();
      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
    })
  })
})