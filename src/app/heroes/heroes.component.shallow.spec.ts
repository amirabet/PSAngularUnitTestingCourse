import { of } from "rxjs";
import { Component, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Hero } from "../hero";
import { HeroesComponent } from "./heroes.component"
import { HeroService } from "../hero.service";
import { By } from "@angular/platform-browser";

describe('Heroes Component (Shallow Test)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES: {}[];

  /*
  * HeroesComponent has HeroCompoent as child in it's template.
  * We will create a mock component to override it,
  * because the test scope should be only in this component.
  * 
  * We will recreate hero-component building
  */
  @Component({
    selector: "app-hero",
    template: '<div></div>', //super simple template
    // removed styleUrl
  })
  /*
  * HeroComponent fake Class:
  * export modifier => removed
  * @Output() => removed
  * All class methods => removed
  */
  class FakeHeroComponent {
    @Input() hero: Hero;
    //@Output() delete = new EventEmitter();
    // Remove all methods
  }

  beforeEach(() => {
    /*
    * Add a fresh copy of heroes in each test initialize
    */
    HEROES = [
      { id: 1, name: 'Spider Boy', strength: 8 },
      { id: 2, name: 'Wonderful Lady', strength: 24 },
      { id: 3, name: 'Super Dude', strength: 55 },
    ];

    /*
    * We create a mock Service to inject in configureTestingModule
    * with jasmine SpyObject, includin all mehtods of the original Service
    */
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    /*
    * Initializing the module and the component with TestBed
    */
    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        FakeHeroComponent // Fake child component
      ],
      /*
      * Using providers to simulate the service injection 
      * we use longhand initializer where:
      * provide: when this provider is required =>
      * useValue: => we return this value instead (mock service)
      */
      providers: [
        { provide: HeroService, useValue: mockHeroService }
      ],
      // Needed NO_ERRORS_SCHEMA to avoid undesired errors
      //schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  /*
  * Let's test if our mocking implements correctly 
  * Service getHeroes() method.
  * We're simulating the observable with ".and.returnValue(of(returnData))"
  * 
  * Finally we're checking heroes length
  */
  it('should set heroes correctly from the service', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges(); //Starts bindings and fires NgOnInit

    expect(fixture.componentInstance.heroes.length).toBe(3);
  })

  /*
  * A test for dealing wiht List of elements:
  * <li *ngFor="let hero of heroes"> from heroes.component.html
  */
  it('should create one <li> for each hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const heroesLength = HEROES.length;

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(heroesLength);
  })
})