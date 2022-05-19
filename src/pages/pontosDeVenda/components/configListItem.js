import React from 'react'

import { makeStyles } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'
import { RED_PRIMARY } from '../../../misc/colors'

export const ConfigListItem = ({ Sel, Produtos, ProdCod, TiposDeVenda, TVendaId, V1, V2, Receitas, RecId, Linha, onUpdateConfig, onRemoveConfig, Editing }) => {
  const classes = useStyles();

  return (
    <div className={classes.line}>
      <input disabled={Editing} type='text' value={Sel} onChange={(e) => onUpdateConfig('Sel', e.target.value, Linha)} placeholder='Sel.' className={classes.Sel} />
      <select
        disabled={Editing}
        value={ProdCod}
        onChange={(e) => onUpdateConfig('ProdId', e.target.value, Linha)}
        className={classes.Prod}
      >
        <option
          className={classes.Opt}
          value={null}
          selected={true}
          disabled={true}
        >
          Selecione...
        </option>
        {Produtos.map(prod => (
          <option
            className={classes.Opt}
            value={prod.ProdId}
          >
            {prod.Produto}
          </option>
        ))}
      </select>
      <select
        disabled={Editing}
        value={TVendaId}
        onChange={(e) => onUpdateConfig('TipoVenda', e.target.value, Linha)}
        className={classes.TV}
      >
        <option
          className={classes.Opt}
          value={null}
          selected={true}
          disabled={true}
        >
          Selecione...
        </option>
        {TiposDeVenda.map(Tv => (
          <option
            className={classes.Opt}
            value={Tv.TveId}
          >
            {Tv.TveDesc}
          </option>
        ))}
      </select>
      <input disabled={Editing} type='text' value={V1} onChange={(e) => onUpdateConfig('Valor_1', e.target.value, Linha)} placeholder='Valor 1' className={classes.Val} />
      <input disabled={Editing} type='text' value={V2} onChange={(e) => onUpdateConfig('Valor_2', e.target.value, Linha)} placeholder='Valor 2' className={classes.Val} />
      <select
        disabled={Editing}
        value={RecId}
        onChange={(e) => onUpdateConfig('RecId', e.target.value, Linha)}
        className={classes.Rec}
      >
        <option
          className={classes.Opt}
          value={null}
          selected={true}
          disabled={true}
        >
          Selecione...
        </option>
        {Receitas.map(rec => (
          <option
            className={classes.Opt}
            value={rec.RecId}
          >
            {rec.RecDesc}
          </option>
        ))}
      </select>
      <div className={classes.ButtonContainer} onClick={() => {
        if (Editing) {
          alert('Ative a edição para remover bebidas da configuração')
        } else {
          onRemoveConfig(Linha)
        }
      }}>
        <CloseIcon />
      </div>
    </div>
  )
}


const useStyles = makeStyles((theme) => ({
  line: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'no-wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minWidth: '500px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: '#333',
    margin: '0px 0px 4px 0px'
  },
  Sel: {
    width: '100% !important',
    minWidth: '30px !important',
    maxWidth: '50px !important',
    textAlign: 'center',
    height: '100% !important',
    borderRadius: '18px 0px 0px 18px !important',
    backgroundColor: '#CCC !important'
  },
  Prod: {
    display: 'block',
    // width: '100%',
    cursor: 'pointer',
    backgroundColor: '#CCC',
    // maxWidth: '300px',
    width: '300px',
    height: '100%',
    borderRadius: '0px',
    border: 'none'
  },
  Opt: {
    cursor: 'pointer'
  },
  TV: {
    display: 'block',
    // width: '100%',
    cursor: 'pointer',
    backgroundColor: '#CCC',
    // maxWidth: '200px',
    width: '200px',
    height: '100%',
    borderRadius: '0px',
    border: 'none'
  },
  Val: {
    width: '100% !important',
    minWidth: '40px !important',
    maxWidth: '70px !important',
    height: '100% !important',
    borderRadius: '0px !important',
    backgroundColor: '#CCC !important',
    padding: '0px 0px 0px 8px !important'
  },
  Rec: {
    display: 'block',
    // width: '100%',
    cursor: 'pointer',
    backgroundColor: '#CCC',
    // maxWidth: '200px',
    width: '200px',
    height: '100%',
    border: 'none'
  },
  ButtonContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '0px 18px 18px 0px !important',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RED_PRIMARY,
    cursor: 'pointer'
  }
}));

















{/* <form
      className={classes.root}
      noValidate
      autoComplete="off"
    >
      <TextField
        className={classes.TextInput}
        label="Seleção"
        variant="standard"
        value={Sel}
        onChange={() => { }}
      />
      <FormControl
        variant="standard"
        className={classes.formControl}
      >
        <InputLabel>Produto</InputLabel>
        <Select
          value={ProdCod}
          onChange={() => { }}
          label="Produto"
        >
          {Produtos.map(prod => (
            <MenuItem value={prod.ProdId}>
              {prod.Produto}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        variant="standard"
        className={classes.formControl}
      >
        <InputLabel>Tipo de Venda</InputLabel>
        <Select
          value={TVendaId}
          onChange={() => { }}
          label="Tipo de Venda"
        >
          {TiposDeVenda.map(Tv => (
            <MenuItem value={Tv.TveId}>
              {Tv.TveDesc}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        className={classes.TextInput}
        label="Valor 1"
        variant="standard"
        value={V1}
        onChange={() => { }}
      />
      <TextField
        className={classes.TextInput}
        label="Valor 2"
        variant="standard"
        value={V2}
        onChange={() => { }}
      />
      <FormControl
        variant="standard"
        className={classes.formControl}
      >
        <InputLabel>Receita</InputLabel>
        <Select
          value={RecId}
          onChange={() => { }}
          label="Receita"
        >
          {Receitas.map(rec => (
            <MenuItem value={rec.RecId}>
              {rec.RecDesc}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form> */}

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     flexDirection: 'row',
//     flexWrap: 'no-wrap',
//     alignItems: 'center',
//     justifyContent: 'center',
//     '& > *': {
//       margin: theme.spacing(1),
//       width: '25ch',
//     },
//   },
//   TextInput: {
//     '& div>input:nth-child(1)': {
//       marginLeft: '8px',
//     },
//   },
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//   }
// }));