import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library'
import 'jest-dom/extend-expect'

describe('editMode tests', () => {
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
    })
})
