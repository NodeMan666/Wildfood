var chai=require('chai');
var assert=require('assert');
var chaiAsPromised=require('chai-as-promised');
chai.use(chaiAsPromised);
var expect=chai.expect;

describe('angularjs homepage todo list', function() {
    it('should add a todo', function() {
        this.timeout(1000000);
        browser.get('http://www.angularjs.org');

        element(by.model('todoText')).sendKeys('write a protractor test');
        element(by.css('[value="add"]')).click();

        var todoList = element.all(by.repeater('todo in todos'));

       // assert.equal(3, todoList.count());

        expect(todoList.count()).to.eventually.equal(3);
        expect(todoList.get(2).getText()).to.eventually.equal('write a protractor test');
    });
});
