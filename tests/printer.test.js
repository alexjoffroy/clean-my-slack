
const sinon = require('sinon')
const {expect} = require('./helpers/chai')
const {relative} = require('./helpers/path')
const Printer = require('../src/printer')

describe(relative(__filename), () => {

    let chalk, printer
    
    before(() => {
        chalk = {
            green: sinon.stub().callsFake((message) => `[green]${message}`),
            red: sinon.stub().callsFake((message) => `[red]${message}`)
        }
        
        printer = new Printer(chalk)
    })
    
    it('prints an info', () => {
        sinon.stub(console, 'log')

        const message = 'Something useful.'
        printer.info(message)        

        expect(console.log).to.have.been.calledOnceWith(message)

        console.log.restore()
    })
    
    it('prints an error', () => {
        sinon.stub(console, 'log')

        const message = 'An error occured.'
        printer.error(message)        

        expect(console.log).to.have.been.calledOnceWith(`[red]${message}`)
        expect(chalk.red).to.have.been.calledOnceWith(message)

        console.log.restore()
    })
    
    it('prints a success message', () => {
        sinon.stub(console, 'log')

        const message = 'You did it!'
        printer.success(message)        

        expect(console.log).to.have.been.calledOnceWith(`[green]${message}`)
        expect(chalk.green).to.have.been.calledOnceWith(message)

        console.log.restore()
    })

})