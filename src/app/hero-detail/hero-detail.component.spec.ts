import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

/*
 * In this test we're gonna check if this component
 * is using the Router properly.
 * We wont' focus on Router results, cause we assume that
 * THE FRAMEWORK WORKS FINE AND WE HAVE NEVER TO TEST IT.
 *
 * We'll focus on how we use the Router from the compoent.
 */
describe('Hero Detail Component', () => {
  /*
   * This variables will hold mock services
   */
  let mockActivatedRoute, mockHeroService, mockLocation;

  let fixture: ComponentFixture<HeroDetailComponent>;

  beforeEach(() => {
    /*
     * We implement mockServices with it's methods
     * with jasmine's createSpyObj('methodNames'[])-
     *
     * The mockActivatedRoute case is fair more complex and we
     * create manually an object, simplier than using createSpyObj
     */
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => {
            return '3';
          },
        },
      },
    };
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);

    TestBed.configureTestingModule({
      /*
       * We have to import FormsModule in order to
       * work wiht NgModel present in <input [(ngModel)]="hero.name" placeholder="name"/>
       * hero-detail.component template
       */
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      /*
       * We provide 3 mock services used in Routing
       */
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation },
      ],
    });

    fixture = TestBed.createComponent(HeroDetailComponent);

    /*
     * here we're mocking getHero service method
     */
    mockHeroService.getHero.and.returnValue(
      of({ id: 3, name: 'Super Dude', strength: 100 })
    );
  });

  /*
   * One way to test if Router properly loaded the page
   * is by checking h2 heading 'hero-detail.component' template
   */
  it('Testing Rouer: should render hero name in h2 tag', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain(
      'SUPER DUDE'
    );
  });

  /*
  * Here we test an async function thats using a debounce method.
  * To mathc with debounce method we use a setTimeout methos with a
  * fixed delay to wait for debouncing finalization.
  * 
  * NOTICE that a "done" parameter is added to test callback.
  * The "done()" raises a flag when is called that allows us to 
  * run any asyncronous code
  */
  it('Async method test with fixed Timeout: should call updateHero when save is called', (done)=>{
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();

    /*
    * To correctly check the test we have to wait more than 250ms to launch expect() method.
    * This Timeout corresponds to debounce function delay.
    * We also call the done() parameter.
    */
    setTimeout(() => {
      expect(mockHeroService.updateHero).toHaveBeenCalled();
      done();
    }, 300)
  })

  /*
  * In this other variation of async function testing we use
  * a different approach: without setTimeout and "done" parameter.
  * The fakeAsync method wraps all test's callback
  */
  it('Async method test with fakeAsync and tick: should call updateHero when save is called', fakeAsync(()=>{
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();

    /*
    * We use tick() method to delay expect execution 250ms
    */
    //tick(250);
    /*
    * We have also the more universal flush that will wait to
    * any ongoing async methods to be executed, saving us from
    * setting manually a certaint timeout waiting and making
    * tests more universal
    */
    flush();

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));

  /*
  * Finally we use this variations aimed to test promsies,
  * using waitForAsync instead of fakeAsync wrapper.
  * 
  * To wait to promise resolution we have whenStable() as a
  * fixture method
  */
  it('Async method test with promises: should call updateHero when savePromised is called', waitForAsync(()=>{
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.savePromised();

    /*
    * We use whenStable, wich is a fixture method that it itself a promise.
    * This promise will be resolved when the testing promise is resolved
    */
    fixture.whenStable().then(() => {
      expect(mockHeroService.updateHero).toHaveBeenCalled();
    })
  }));

});
