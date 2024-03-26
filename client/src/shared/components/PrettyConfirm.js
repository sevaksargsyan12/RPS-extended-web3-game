import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function App() {
    const [content, setContent] = useState('');
    const [openDialog, setOpen] = useState(false);
    const [resolver, setResolver] = useState({ resolver: null });

    const handleClose = () => {
        resolver.resolve(false);
        setOpen(false);
    };

    const handleConfirm = () => {
        resolver.resolve(true);
        setOpen(false);
    };

    const getConfirmation = async (text) => {
        setContent(text);
        setOpen(true);

        return new Promise(( resolve, reject ) => {
            setResolver({ resolve })
        });;
    }

    const PrettyConfirm = () => (
        <div>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Action"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
    return [ getConfirmation, PrettyConfirm ]
}

export default App;
