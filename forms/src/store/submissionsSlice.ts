import { createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type { FormSubmission } from '../types/form';

type SubmissionsState = {
    items: FormSubmission[];
    latestId: string | null;    
};

const initialState: SubmissionsState = {
    items: [],
    latestId: null,
};

const submissionsSlice = createSlice({
    name: 'submissions',
    initialState,
    reducers: {
        addSubmission: (state, action: PayloadAction<FormSubmission>) => {
            state.items.push(action.payload);
            state.latestId = action.payload.id;
        },
    },
});

export const { addSubmission } = submissionsSlice.actions;

export const selectSubmissions = (state: { submissions: SubmissionsState}) =>
    state.submissions.items;

export const selectLatestSubmissionId = (state: { submissions: SubmissionsState}) =>
    state.submissions.latestId;

export default submissionsSlice.reducer;