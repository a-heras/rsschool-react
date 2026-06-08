import { describe, expect, it } from 'vitest';
import submissionsReducer, { addSubmission } from './submissionsSlice';
import type { FormSubmission } from '../types/form';

const mockSubmission: FormSubmission = {
  id: '1',
  formType: 'uncontrolled',
  name: 'Anna',
  age: 25,
  email: 'anna@mail.com',
  gender: 'female',
  termsAccepted: true,
  imageBase64: 'data:image/png;base64,abc',
  country: 'Belarus',
  submittedAt: '2026-06-08T10:00:00.000Z',
};

describe('submissionsSlice', () => {
  it('adds submission to items and sets latestId', () => {
    const state = submissionsReducer(undefined, addSubmission(mockSubmission));

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockSubmission);
    expect(state.latestId).toBe('1');
  });
});