import { MessageService } from "./message.service";

describe('Message Service', () => {
  /* 
  * First of All we initialize the service with 
  */
  let service: MessageService;

  beforeEach(() => {
    /*
    * It's better repeat this code to achieve each Test encapsulated meaning
    */
    // service = new MessageService();

  })

  it('shoud have no messages to start', () => {
    /*
    * ARRANGE
    * is inside the BeforeEach so we're missing Test "Tell a story" rule.
    * S we will duplicate in each it()
    */
    service = new MessageService();

    /*
    * ACT
    * Nothing to do here
    */

    /*
    * ASSERT
    * Check that by default we have zero messages
    */
    expect(service.messages.length).toBe(0);

  })

  it('shoud add a message when add is called', () => {
    service = new MessageService();

    service.add('Message 1');

    expect(service.messages.length).toBe(1);
  })

  it('shoud remove all messages when clear is called', () => {
    service = new MessageService();
    service.add('Message 1'); // Notice that is part of the arrange

    service.clear();
    
    expect(service.messages.length).toBe(0);
  })
});