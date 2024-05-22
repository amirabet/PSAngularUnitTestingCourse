import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesComponent } from './heroes.component';
import { HeroService } from '../hero.service';
import { By } from '@angular/platform-browser';
import { HeroComponent } from '../hero/hero.component';
import { Directive, Input, NO_ERRORS_SCHEMA } from '@angular/core';

/*
 * Another way to avoid RouterLink in Erros in test, insted of using
 * TestBed.configureTestingModule( schemas: [NO_ERRORS_SCHEMA] )
 * we can create this directive to capture routerLink Value on click
 * and mock RouterLink
 */
@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' },
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('Heroes Component (Deep Test)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    /*
     * Add a fresh copy of heroes in each test initialize
     */
    HEROES = [
      { id: 1, name: 'Spider Boy', strength: 8 },
      { id: 2, name: 'Wonderful Lady', strength: 24 },
      { id: 3, name: 'Super Dude', strength: 55 },
    ];

    mockHeroService = jasmine.createSpyObj([
      'getHeroes',
      'addHero',
      'deleteHero',
    ]);

    /*
     * Initializing the module and the component with TestBed
     */
    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent, // The real Child Component to deep test it
        RouterLinkDirectiveStub, // The RouterLink mock that alows to not use [NO_ERRORS_SCHEMA]
      ],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
      /*
       * We can use RouterLinkStub as alternative to [NO_ERRORS_SCHEMA]
       */
      //schemas: [NO_ERRORS_SCHEMA], //avoids missing RotulerLInk error
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
    const heroComponentsDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    expect(heroComponentsDEs.length).toBe(3);

    /*
     * With the debnug element we can go further and
     * grab the component instance
     */
    expect(heroComponentsDEs[0].componentInstance.hero.name).toEqual(
      'Spider Boy'
    );
    expect(heroComponentsDEs[1].componentInstance.hero.name).toEqual(
      'Wonderful Lady'
    );
    expect(heroComponentsDEs[2].componentInstance.hero.strength).toEqual(55);

    /*
     * Checking HERO data integrity
     */
    for (let i = 0; i < heroComponentsDEs.length; i++)
      expect(heroComponentsDEs[i].componentInstance.hero).toEqual(HEROES[i]);
  });

  /*
   * In this test we will Trigger the delete event from heroes.component that calls delete method.
   * In the description we use backticks due that it's a long text
   */
  it(`should call heroService.deleteHero when the Hero Component's
    detele button is clicked`, () => {
    /*
     * First we set a jazzmin spy object that will track future
     * delete method trigger
     */
    spyOn(fixture.componentInstance, 'delete');

    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    /*
     * We'll take all HEROES components to work with as a collection
     * by using queryAll and using component's Class directive as a query Parameter
     */
    const heroComponents = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    /*
    * Now we take the first element and using css selector of the param query
    * we get the button element, of whose we call it's 
    * triggerEventHandler('eventName',{object with the event}).
    * 
    * We're emulating this code from hero.component
      onDeleteClick($event): void {
        $event.stopPropagation();
        this.delete.next();
      }
    */
    heroComponents[0]
      .query(By.css('button'))
      .triggerEventHandler('click', { stopPropagation: () => {} });

    /*
     * Finally, we create the expectation using spyOn jazzmin object
     */
    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  /*
   * Another variation where we trigger the methd directly from the child component
   * instead of forcing the click event
   */
  it(`should call heroService.deleteHero when the Hero Component's
    triggers it's delete method`, () => {
    spyOn(fixture.componentInstance, 'delete');

    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    /*
     * Now we take the second hero element using componentInstance.
     * Notice how we type the query: <HeroComponent>heroComponents[1].componentInstance
     *
     * Once we do this we have access to all component's public members,
     * so we will work on delete method that, being an EventEmmiter, needs emit to be executed raised
     *
     * We emit an undefined value because in the original method, we do:
     * this.delete.next();
     * and next property has no parameter, being the same than this "undefined"
     */
    (<HeroComponent>heroComponents[1].componentInstance).delete.emit(undefined);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[1]);
  });

  /*
   * Finally a variation where we raise events from Child Directives
   */
  it(`should call heroService.deleteHero when the Hero Component's Directive
    triggers triggerEventHandler directly on Component's fixture`, () => {
    spyOn(fixture.componentInstance, 'delete');

    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    /*
     * Now we take the third hero element using
     * triggerEventHandler('eventName', {eventObject})
     *
     * We call this method directly on component Fixture.
     *
     * Maybe the event doesn't exist, so we test both behaviours in this shorthand method
     */
    heroComponents[2].triggerEventHandler('delete', null);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[2]);
  });

  /*
   * We're gonna test behaviours on input boxes by testing events on
   * <input #heroName /> and <button (click)="add(heroName.value); heroName.value=''">
   * from 'heroes.component.html'
   */
  it('should annd new hero to the hero list when the add button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    /*
     * Creating a new fake hero to add
     */
    const newHeroName = 'Mr. Ice';

    /*
    * Using mocked service with 'add' method that we created earlier:
    mockHeroService = jasmine.createSpyObj([
      'getHeroes',
      'addHero',
      'deleteHero',
    ]);
    * to emulate the component's method
    this.heroService.addHero({ name, strength } as Hero).subscribe((hero) => {
      this.heroes.push(hero);
    });
    */
    mockHeroService.addHero.and.returnValue(
      of({ id: 5, name: newHeroName, strength: 4 })
    );

    /*
     * Now we find for the input element inside the component and set it's value
     * with our desired newHeroName.
     * We also find the button: we have to refine our query because on the
     * hero.component (child) there are also some buttons.
     * So we pick firs result of queryAll.
     * Once we got our button we can trigger it's click event
     */
    const inputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    const buttonElement = fixture.debugElement.queryAll(By.css('button'))[0];

    /*
     * Performing the actions on DOM elements
     * that ultimately will call our desired method.
     * With fixture.detectChanges(); we're updating component's state
     */
    inputElement.value = newHeroName;
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    /*
     * After triggering the methods, we check if the new Hero
     * is in the Heroes list
     */
    const heroesText = fixture.debugElement.query(By.css('ul')).nativeElement
      .textContent;
    expect(heroesText).toContain(newHeroName);
  });

  /*
   * Let's write a Test aimed to the RouterLinks
   * using the stub created by our custom directive
   * RouterLinkDirectiveStub
   * created at the beggining of this file
   */
  it('RouterLink: Should have the correct route for the first hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    /*
     * Retrieve our RouterLinkDirectiveStub from the first element of heroes' list.
     * Notice how after the query we're using injector.get(RouterLinkDirectiveStub)
     * for being able to use the directive
     */
    let routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    /*
     * Then we go back to our first hero element to retrieve
     * the <a> anchor tag that holds the routerLink attribute
     * an click it
     */
    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    /*
     * So we will finally check the routerLink value after the click
     */
    expect(routerLink.navigatedTo).toBe('/detail/1');
  });
});
