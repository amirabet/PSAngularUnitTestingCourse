import { By } from "@angular/platform-browser";
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HeroComponent } from "./hero.component"

/*
* This file contains ".shallow.spec" suffix just to be more explicit
* about type of test performed. In production ".spec" suffix is ok.
* Íddem for the description title "(shallow tests)"
*/
describe('HeroComponent (shallow tests)', () => {
    /*
    * This Var holds the TestBed.createComponent result
    * wich is a representation of component class itself.
    * So we type it as ComponentFixture including generic
    * of current component
    */
    let fixture: ComponentFixture<HeroComponent>;

    beforeEach(() => {
        /*
        * Using TestBed wich is an utility that allows to test
        * both component and its template
        */

        /*
        * First we create a new module also using TestBed.
        * configureTestingModule has a paramtere that contains
        * an object as a parameter: a Module definition 
        * (same that is inside @NgModule directive)
        * 
        * To be concise, we only import HeroComponent for the test
        */
        TestBed.configureTestingModule({
            //imports
            //declarations
            declarations: [HeroComponent],
            //providers
            //bootstrap
            schemas: [NO_ERRORS_SCHEMA] // To avoid rotuerLink issue
        });

        /*
        * Then we can create ou Component instance,
        * again using TestBed with createComponent method,
        * wich takes the component Class.
        * With the result we fill fixture var, 
        * that is the component representation
        */
        fixture = TestBed.createComponent(HeroComponent);
    })

    /*
    * With fixture set, we hava available a lot of stuff
    * inlcuding the component itself with "fixture.componentInstance"
    * and all its methods. Let's test it!
    */
    it('should have the correct hero', () => {
        fixture.componentInstance.hero = { id: 1, name: 'SuperDude',strength: 90 }
        
        /*
        * fixture.detectChanges() allows to detect any change on component data
        * but here throwns an error due to template's use of RouterLink
        * that is solved using "schemas: [NO_ERRORS_SCHEMA]" in
        * TestBed.configureTestingModule({ options })
        */
        fixture.detectChanges();
        expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
    })

    /*
    * Testing Rendered HTML:
    * We'll check the content of de rendered html through JS
    */
    it('should render hte hero name in anchor tag', () => {
        fixture.componentInstance.hero = { id: 1, name: 'SuperDude',strength: 90 };
        /*
        * detectChanges() is necessary to trigger the bindings to the template
        */
        fixture.detectChanges();

        /*
        * nativeElement represents the DOM element corresponding
        * to Component's container tag "<hero-component></hero-component>".
        * Then we just use plain JS querySelector to access other component's childs
        */
        expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');
        
        /*
        * debugElement it's similar to nativeElement but weith it's own properties.
        * Doesn't user JS browser API for targeting chiold tags, instead uses
        * query, queryAll and queryAllNodes.
        * In the predicate of query we use By, wich is a library from "@angular/platform-browser"
        * and allows to select elements using CSS selectors or directives.
        * In this case we're using css selector to target anchor tag
        * (we can also use other selectors: .class, #id... It's similar to jQuery selecting 💗)
        * 
        * After this target, we have nativeElement ready to use, and inspecti it via browser API.
        * In cases like this, toContain() it's a better strategy to ensure success on subtle changes
        */
        expect(fixture.debugElement.query(By.css('a')).nativeElement.textContent).toContain('SuperDude');

        // Making a var to resuse fixture.debugElement if it's necessary:
        let deA = fixture.debugElement.query(By.css('a'));
        expect(deA.nativeElement.textContent).toContain('SuperDude');
    })
})