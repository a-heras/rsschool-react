import { useState, useRef } from 'react'
import { Modal } from './components/Modal/Modal'
import { SubmissionsList } from './components/SubmissionsList/SubmissionsList';
import { UncontrolledForm } from './forms/UncontrolledForm/UncontrolledForm';
import { ReactHookForm } from './forms/ReactHookForm/ReactHookForm';
import './App.css';

function App() {
	const [openForm, setOpenForm] = useState<'uncontrolled' | 'rhf' | null>(null);

	const uncontrolledButtonRef = useRef<HTMLButtonElement>(null);
	const rhfButtonRef = useRef<HTMLButtonElement>(null);

	return (
		<main className="app">
			<h1>React Forms</h1>
			<div className="app__actions">
				<button ref={uncontrolledButtonRef} type="button" onClick={() => setOpenForm('uncontrolled')}>
					Open Uncontrolled Form
				</button>
				<button ref={rhfButtonRef} type="button" onClick={() => setOpenForm('rhf')}>
					Open React Hook Form
				</button>
			</div>
			<Modal
				isOpen={openForm !== null}
				onClose={() => setOpenForm(null)}
				title={
				openForm === 'uncontrolled'
					? 'Uncontrolled Form'
					: 'React Hook Form'
				}
				returnFocusRef={
					openForm === 'uncontrolled' ? uncontrolledButtonRef : rhfButtonRef
				}
			>
				{openForm === 'uncontrolled' ? (
					<UncontrolledForm onSuccess={() => setOpenForm(null)} />
				) : (
					<ReactHookForm onSuccess={() => setOpenForm(null)} />
				)}
			</Modal>
			<SubmissionsList />
		</main>
	);
}

export default App;