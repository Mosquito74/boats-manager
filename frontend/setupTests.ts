import {beforeEach, expect, vi} from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

beforeEach(() => {
    vi.clearAllMocks();
});