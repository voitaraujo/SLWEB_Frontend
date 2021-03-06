import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Content = () => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Aviso
      </DialogTitle>
      <DialogContent dividers>
        <div className="YAlign">
          <Typography
            variant='h6'
            gutterBottom
            style={{ textAlign: 'center', marginBottom: '16px' }}
          >
            Agradecemos o preenchimento do question??rio e ressaltamos que as
            informa????es ser??o tratadas com a devida discri????o.
          </Typography>

          <Typography
            variant='body1'
            gutterBottom
            style={{ textAlign: 'center', fontWeight: '500' }}
          >
            Trata-se de um question??rio abrangente. A coleta de todas as
            informa????es tem como objetivo avaliar se o que temos para
            oferecer est?? dentro da expectativa e vice-versa, visando com
            isso promover o sucesso do empreendimento. Estamos tamb??m ??
            disposi????o caso se deseje qualquer informa????o sobre a Pil??o
            Professional ou sobre o nosso sistema de franquia.
          </Typography>

          <Typography
            variant='subtitle1'
            gutterBottom
            style={{ textAlign: 'center', fontWeight: '500' }}
          >
            Caso exista mais de uma pessoa na condu????o do neg??cio, que ir??
            participar do dia a dia da opera????o, participando ou n??o
            formalmente no contrato social, ?? imprescind??vel que seja
            enviado um question??rio para cada pessoa envolvida.
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Content