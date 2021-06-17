import React from 'react';
 
import { render, fireEvent, act, cleanup } from '@testing-library/react';
import Component from './index';
 
const originalOffsetTop = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetTop')
 
beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetTop', { configurable: true, value: 1000 })
    Object.defineProperty(HTMLElement.prototype, 'scrollTop', { configurable: true, value: 300 })
})
 
afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetTop', originalOffsetTop)
})
 

afterEach(cleanup)
 
describe('Scroll Component', () => {
    it('should render with children', () => {
        const { container } = render(
            <Component >
                <div name="item 1" id="item1"></div>
                <div name="item 2" id="item2"></div>
            </Component>, { container: document.createElement('div') })
        const parent = container.querySelector('.scrollspy')
        expect(parent).not.toBeNull()
    })
 
    it('should focus on menu', () => {
        const { container } = render(
            <Component >
                <div name="item 1" id="item1"></div>
                <div name="item 2" id="item2"></div>
            </Component>, { container: document.createElement('div') })
        const Item1 = container.querySelector('button[title=item1]')
        const spy = jest.spyOn(Item1, 'focus');
        act(() => Item1.focus())
        expect(spy).toBeCalled()
    })
 
    it('should select menu if enter is pressed', async () => {
        window.HTMLElement.prototype.scrollIntoView = function () { };
        const { container, getByText } = render(
            <Component >
                <div name="item 1" id="item1"></div>
               <div name="item 2" id="item2"></div>
            </Component>)
        const Item2 = container.querySelector('button[title=item2]')
        Item2.focus();
        fireEvent.keyPress(Item2, { key: "Enter", code: 13, charCode: 13 });
        await (() => {
            expect(getByText('item2').classList.contains('active')).toBeTruthy();
        })
    })
 
    it('should not select menu if "a" is pressed', async () => {
        window.HTMLElement.prototype.scrollIntoView = function () { };
        const { container, getByText } = render(
            <Component >
                <div name="item 1" id="item1"></div>
                <div name="item 2" id="item2"></div>
            </Component>)
        const Item2 = container.querySelector('button[title=item2]')
        // act(() => Item2.focus())
        Item2.focus();
        fireEvent.keyPress(Item2, { key: 'A', code: 'KeyA', charCode: 65 });
        await (() => {
            expect(Item2.classList.contains('active')).not.toBeTruthy();
        })
    })
 
    it('should show menu (item5) active if scroll to bottom close to item 5 content', () => {
        window.HTMLElement.prototype.scrollIntoView = function () { };
        const { container, getByText } = render(
            <Component />
        )
 
        const Item5 = container.querySelector('button[title=item5]')
        act(() => Item5.focus())
        const ContentContainer = container.querySelector('.asideContent')
        fireEvent.scroll(ContentContainer, { target: { scrollY: 1000 } });
 
        expect(getByText('item2').classList.contains('active')).not.toBeTruthy();
    })
 
    it('should set offsetTop to 700 and item would change to 700', async () => {
        window.HTMLElement.prototype.scrollIntoView = () => { };
        const { container, getByText, getByTestId } = render(<Component />)
        const ContentContainer = container.querySelector('.asideContent')
        ContentContainer.addEventListener('scroll', () => { });
        const Item5 = getByTestId('item5')
        Object.defineProperty(HTMLElement.prototype, 'offsetTop', { configurable: true, value: 1050 })
        expect(Item5.offsetTop).toEqual(1050)
        fireEvent.scroll(ContentContainer, { target: { scrollY: 1050 } });
        await (() => {
            expect(getByText('item5').classList.contains('active')).toBeTruthy();
        })
    })



    it('should render even no id nor name are provided', () => {
        const { container } = render(
            <Component><div></div><div></div></Component>
            , { container: document.createElement('div') })
        const Container = container.querySelector('.scrollspy')
        expect(Container).not.toBeNull()
    })
 
    it('should render default list without children', () => {
        const { container } = render(
            <Component />
            , { container: document.createElement('div') })
        const parent = container.querySelector('.scrollspy')
        expect(parent).not.toBeNull()
    })
 
    it('should select menu if click on menu', async () => {
        window.HTMLElement.prototype.scrollIntoView = function () { };
        const { getByLabelText } = render(
            <Component />)
        const item5Btn = getByLabelText('item5');
        fireEvent.mouseDown(item5Btn);
        await (() => {
            expect(item5Btn.classList.contains('active')).toBeTruthy();
        })
 
    })
 
})