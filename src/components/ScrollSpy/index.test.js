import React from 'react';
import { render } from '@testing-library/react';
import Component from './index';
 

describe('ScrollSpy', () => {
 
    it('would render with children', () => {
        const { container } = render(
            <Component >
                <div name="item 1" id="item1"></div>
                <div name="item 2" id="item2"></div>
            </Component>, { container: document.createElement('div') })
        const parent = container.querySelector('.main')
        expect(parent).not.toBeNull()
    })
 
    it('would render without children', () => {
        const { container } = render(
            <Component />, { container: document.createElement('div') })
        const parent = container.querySelector('.main')
        expect(parent).not.toBeNull()
    })
 
})