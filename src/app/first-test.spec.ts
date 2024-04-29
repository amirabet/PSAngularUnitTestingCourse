/*
* All tests begin with the "describe()" method
*/
describe('my first test', () => {
    /*
    * We're inside the callback present in each test
    */
    let sut; // refers to "System Under Test"

    /*
    * Prior to our test begins we use this beforeEach method that has a callback as parameter
    * This methos will be exectued before each test is executed
    */
    beforeEach(() => {
        sut = {};
    })

    /*
    * This is an actual test
    * Begins with it() function, and 2 parameters:
    * 
    * 1st parameter: test description
    * On tests summary we'll see this method as
    * "my first test I'm the text descritpion, so: 'shoud be true if true'"
    * 
    * 2nd parameter: callback, that has 3 main parts (AAA method).
    */
    it('I\'m the text descritpion, so: \'shoud be true if true\'', () => {
        /*
        * Part 1: Arrange
        * to set up the preconditions of the test
        */
       sut.a = false;

        /*
        * Part 2: Act
        * to make actions in the part that we want to test
        */
        sut.a = true;

        /*
        * Part 3: Assert
        * check if the preconditions of the test are fullfilled
        * using the method toBe(expectedValue)
        * 
        * "toBe" is known as Matcher function, and there are so many of them:
        * toBecloseTo, toBefalsy, toBeLessThan, toBeNaN, toContain, toEqual...
        */
        expect(sut.a).toBe(true);
    })
})