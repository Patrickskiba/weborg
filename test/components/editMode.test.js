import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library'
import userEvent from 'user-event'
import 'jest-dom/extend-expect'

describe('editMode tests', () => {
    afterEach(cleanup)

    it('renders 3 editiable fields and can save them', () => {
        const mockProps = {
            editNode: JSON.parse("{\"type\":\"headline\",\"index\":1,\"level\":2,\"content\":[{\"type\":\"text\",\"text\":\"rsync\"}],\"children\":[{\"type\":\"section\",\"index\":2,\"content\":[{\"type\":\"text\",\"text\":\" Copy a file with a progress bar\"}]},{\"type\":\"section\",\"index\":3,\"content\":[{\"type\":\"text\",\"text\":\" sudo rsync --info=progress2 source dest\"}]}]}"),
            setEditNode: jest.fn(),
            text: `* Great Unix Tools\n** rsync\nCopy a file with a progress bar\nsudo rsync --info=progress2 source dest\n** du - disk usage\ndu -sh file_path\n-s : summarized\n-h : human readable\n** pacman\nsearch pacman\n- sudo pacman -Ss package_name`,
            setText: jest.fn()
        }

        const EditMode = require('../../src/components/EditMode').default
        const { getByText, getByLabelText, container } = render(<EditMode {...mockProps} />)

        
        const level = getByLabelText('Level')
        const headline = getByLabelText('Headline')
        const content = getByLabelText('Content')

        expect(level.value).toEqual('2')

        expect(headline.value).toEqual('rsync')

        expect(content.value).toEqual(' Copy a file with a progress bar\n sudo rsync --info=progress2 source dest')

        expect(container).toMatchSnapshot()
    })

    it('clicking save button does not change original text when making no change', () => {
        const mockProps = {
            editNode: JSON.parse("{\"type\":\"headline\",\"index\":1,\"level\":2,\"content\":[{\"type\":\"text\",\"text\":\"rsync\"}],\"children\":[{\"type\":\"section\",\"index\":2,\"content\":[{\"type\":\"text\",\"text\":\" Copy a file with a progress bar\"}]},{\"type\":\"section\",\"index\":3,\"content\":[{\"type\":\"text\",\"text\":\" sudo rsync --info=progress2 source dest\"}]}]}"),
            setEditNode: jest.fn(),
            text: `* Great Unix Tools\n** rsync\n Copy a file with a progress bar\n sudo rsync --info=progress2 source dest\n** du - disk usage\ndu -sh file_path\n-s : summarized\n-h : human readable\n** pacman\nsearch pacman\n- sudo pacman -Ss package_name`,
            setText: jest.fn()
        }

        const EditMode = require('../../src/components/EditMode').default
        const { getByText, getByLabelText, container } = render(<EditMode {...mockProps} />)

        const save = getByText('Click me')

        fireEvent.click(save, { button: 1 })

        expect(mockProps.setText).toHaveBeenCalledWith(mockProps.text)
    })

    it('clicking save button when making a change will set the correct text', () => {
        const mockProps = {
            editNode: JSON.parse("{\"type\":\"headline\",\"index\":1,\"level\":2,\"content\":[{\"type\":\"text\",\"text\":\"rsync\"}],\"children\":[{\"type\":\"section\",\"index\":2,\"content\":[{\"type\":\"text\",\"text\":\" Copy a file with a progress bar\"}]},{\"type\":\"section\",\"index\":3,\"content\":[{\"type\":\"text\",\"text\":\" sudo rsync --info=progress2 source dest\"}]}]}"),
            setEditNode: jest.fn(),
            text: `* Great Unix Tools\n** rsync\n Copy a file with a progress bar\n sudo rsync --info=progress2 source dest\n** du - disk usage\ndu -sh file_path\n-s : summarized\n-h : human readable\n** pacman\nsearch pacman\n- sudo pacman -Ss package_name`,
            setText: jest.fn()
        }

        const EditMode = require('../../src/components/EditMode').default
        const { getByText, getByLabelText, container } = render(<EditMode {...mockProps} />)

        const level = getByLabelText('Level')
        userEvent.type(level, '3')

        const headline = getByLabelText('Headline')
        userEvent.type(headline, 'new headline')

        const content = getByLabelText('Content')
        userEvent.type(content, 'new content\nwith new line')

        const save = getByText('Click me')

        fireEvent.click(save, { button: 1 })

        expect(mockProps.setText).toHaveBeenCalledWith(`* Great Unix Tools\n*** new headline\nnew content\nwith new line\n** du - disk usage\ndu -sh file_path\n-s : summarized\n-h : human readable\n** pacman\nsearch pacman\n- sudo pacman -Ss package_name`)
    })
})
