import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
  

export default function DealModal( {deal} ) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen} size="small">Learn More</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            { deal.name }
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            { deal.description }
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            { deal.discount_info }
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            { deal.address }
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            { deal.phone }
          </Typography>

            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            { deal.email }
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            { deal.website }
        </Typography>
        </Box>
      </Modal>
    </div>
  );
}