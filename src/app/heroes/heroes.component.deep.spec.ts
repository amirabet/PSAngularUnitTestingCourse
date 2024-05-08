import { of } from "rxjs";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HeroesComponent } from "./heroes.component"
import { HeroService } from "../hero.service";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe('Heroes Component (Deep Test)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES: {}[];

  beforeEach(() => {
    /*
    * Add a fresh copy of heroes in each test initialize
    */
    HEROES = [
      { id: 1, name: 'Spider Boy', strength: 8 },
      { id: 2, name: 'Wonderful Lady', strength: 24 },
      { id: 3, name: 'Super Dude', strength: 55 },
    ];

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    /*
    * Initializing the module and the component with TestBed
    */
    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent // The real Child Component to deep test it
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService }
      ],
      schemas: [NO_ERRORS_SCHEMA] //avoids missing RotulerLInk error
    });

    /*
    * Let's initialize the component
    */
    fixture = TestBed.createComponent(HeroesComponent);
  });

  /*
  * Testing each compoent rendering from HEROES Data
  */
  it('should render each hero as a HeroCompoent', () => {

    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    /*
    * Change detection for all the components 
    * and runs ngOnInit
    */
    fixture.detectChanges();

    /*
    * Let's dive into component's child elements
    * that has the directive "HeroComponent",
    * wich is the class that Holds child component.
    * This query will point to all DOM elements inside the component.
    * 
    * The name of the cons "DEs" equals to "Debug Elements"
    */
    const heroComponentsDEs = fixture.debugElement.queryAll(By.directive(HeroComponent))
    expect(heroComponentsDEs.length).toBe(3);

    /*
    * With the debnug element we can go further and
    * grab the component instance
    */
    expect(heroComponentsDEs[0].componentInstance.hero.name).toEqual('Spider Boy');
    expect(heroComponentsDEs[1].componentInstance.hero.name).toEqual('Wonderful Lady');
    expect(heroComponentsDEs[2].componentInstance.hero.strength).toEqual(55);

    /*
    * Checking HERO data integrity
    */
    for (let i = 0; i < heroComponentsDEs.length; i++)
      expect(heroComponentsDEs[i].componentInstance.hero).toEqual(HEROES[i]);
  })
})