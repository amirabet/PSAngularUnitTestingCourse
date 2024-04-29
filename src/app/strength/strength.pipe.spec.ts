import { StrengthPipe } from "./strength.pipe";

describe('Strength Pipe', () => {
    /*
    * First Test!
    */
    it('shoud display "weak" if strength is 5', () => {
        /*
        * ARRANGE
        * Construct a new pipe instance to work with
        */
        let pipe = new StrengthPipe();

        /*
        * ACT
        * Work with Pipe's transform() method
        */
        let val = pipe.transform(5);

        /*
        * ASSERT
        * Check if Act part satisfies out condition
        */
        expect(val).toEqual('5 (weak)');

        /*
        * In this case, ACT and ARRANGE could be set into one line
        */
       //expect(pipe.transform(5)).toEqual('5 (weak)');
    })

    it('shoud display "strong" if strength is 10', () => {
        let pipe = new StrengthPipe();

       expect(pipe.transform(10)).toEqual('10 (strong)');
    })

    /*
    * For a Good Test Coverage, pipe.transform(20)
    * should be tested too...
    */
});