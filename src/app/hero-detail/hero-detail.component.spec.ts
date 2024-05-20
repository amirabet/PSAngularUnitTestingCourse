import { ComponentFixture, TestBed } from '@angular/core/testing';
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
});
