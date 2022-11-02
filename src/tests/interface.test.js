import React from 'react';
import {render, screen, waitFor} from '@testing-library/react'
import AppWrapper from '../app'

test('Test render', async () => {
    const { container } = render(<AppWrapper />)

    expect(container.querySelector('.route-button')).toBeDefined();
    waitFor(() => expect(screen.getByPlaceholderText('Група...')).not.toBeDisabled());
});
