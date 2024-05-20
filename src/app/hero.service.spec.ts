import { TestBed } from "@angular/core/testing"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { HeroService } from "./hero.service"
import { MessageService } from "./message.service";
import { inject } from "@angular/core";

describe('HeroService', () => {

    /*
    * Creating a mock MessageService to use in HeroService constructor
    */
    let mockMessageService;

    /*
    * Importing HttpTestingController from "@angular/common/http/testing"
    * to control the behaviour of the emulated HttpClient via HttpClientTestingModule
    */
    let httpTestingController: HttpTestingController;
    let heroService: HeroService;

    beforeEach(() => {
        /*
        * Initialie mockMessageService with an spyObject
        */
        mockMessageService = jasmine.createSpyObj(['add']);

        TestBed.configureTestingModule({

            /*
            * To emulate HttpClient we use HttpClientTestingModule
            * Needs to be imported manually from "@angular/common/http/testing"
            */
            imports: [HttpClientTestingModule],

            providers: [
                /*
                * We Provide the real service, wich constructor has 2 parameters:
                * HttpClient
                * MessageService => we use mockMessageService
                */
                HeroService,
                { provide: MessageService, useVvalue: mockMessageService }

            ]
        })

        /*
        * Here we control the HttpClientTestingModule usign our httpTestingController
        * in the TestBed with the special method "inject()".
        * The inject() method provides a handler to any Service that is used as a parameter.
        * 
        * This method should be commented and not used  
        * if we want to use the inject method inside 
        * it() testing function
        */
        httpTestingController = TestBed.inject(HttpTestingController);

        /*
        * So we create the handler to HeroService using TestBed.inject()
        * besides adding it to the providers list
        * 
        * This method should be commented and not used  
        * if we want to use the inject method inside 
        * it() testing function
        */
        heroService = TestBed.inject(HeroService);
    })

    /*
    * With all this configuration we're set to test our HttpClientTestingModule.
    * In this scenario we'll test the "getHero()" method:
    * 
    getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url).pipe(
            tap(_ => this.log(`fetched hero id=${id}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }

    * Thanks to using HttpTestingController, all http calls from the service
    * will be interceoted and we will be able to work with them.

    */
    describe('getHero', () => {
        /*
        * Simplier and easier method to use, avoiding inject() inside it()
        * and using httpTestingController = TestBed.inject(HttpTestingController);
        * and
        * heroService = TestBed.inject(HeroService);
        * in beforeEach() method
        */
        it('should call get with the correct url', () => {
            /*
            * With the injected HeroService we can now call it's methods.
            * here we call getHero()
            * 
            * subscribe() it's necessary to fire the getHero() call
            */
            heroService.getHero(4).subscribe();

            /*
            * If we launch a second request the test will fail due to
            * httpTestingController.expectOne, that only expects one 
            * response from the API
            */
            //heroService.getHero(4).subscribe();

            /*
            * If we launch a second request with diferent params: getHeroe(2)
            * the test wo'nt pass due to the use of httpTestingController.verify();
            */
            //heroService.getHero(2).subscribe();

            /*
            * Now we test if this call is right by checking
            * if we are calling the right URL.
            * To do this, we are isung expectOne, that checks 
            * mocks the response of the request made in the given url.
            * 
            * Then, the flush method resolves the get and builds an object
            */
            const req = httpTestingController.expectOne('api/heroes/4');
            req.flush({ id: 4, name: 'SuperDude', strength: 100 });

            /*
            * Make sure that all responses correspond to our flush data
            */
            httpTestingController.verify();

            /*
            * Because this methodology doesn't contains any expect, 
            * it willexecute the tst but throw a warning that
            * en expectation is missing.
            * 
            * We can add an expect in this scenario making an expect
            * to the "req.request", that is the real request object
            * that contains all request data
            */
            expect(req.request.method).toBe('GET'); 


            /*
            * Another way to test http requests is by checking
            * inside subscribe() via expect(), that also resolves
            * "lack of expectation" warning
            */
            heroService.getHero(4).subscribe( hero => {
                expect(hero.id).toBe(4);
                expect(hero.name).toContain('Dude');
            });

        })


        /*
        * ANOTHER WAY TO DO IT (not recommended) 
        * Notice that instead of using an empty callback for it()
        * we use inject() method that wraps all the callback.
        * 
        * inject() method has 2 parameters:
        * 1/ Array with Service Type
        * 2/ The default callback for it() method, that has heroService instance as a parameter
        * 
        * WARNING NOTE:
        * this method is failry complex and it's easier to use 
        * httpTestingController = TestBed.inject(HttpTestingController);
        * and
        * heroService = TestBed.inject(HeroService);
        * in beforeEach() method
        */
        // it('should call get with the correct url', inject(
        //     [
        //         HeroService, 
        //         HttpTestingController
        //     ], 
        //     (
        //         heroService: HeroService, 
        //         httpController: HttpTestingController
        //     ) =>  {
        //         /*
        //         * With the injected HeroService we can now call it's methods.
        //         * here we call getHero()
        //         */
        //         heroService.getHero(4);

        //         /*
        //         * Now he test if this call is right by checking
        //         * the URL validity
        //         */
        //        //httpController.(...)
        //     })
        // )


    })

    /*
    * Simplified without comments test:
    */
    describe('getHeroSimplified', () => {
        it('should call get with the correct url', () => {
            heroService.getHero(4).subscribe();

            const req = httpTestingController.expectOne('api/heroes/4');

            req.flush({ id: 4, name: 'SuperDude', strength: 100 });
            httpTestingController.verify();
        })
    })
})