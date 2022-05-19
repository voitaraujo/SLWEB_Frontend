import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { api } from '../../../services/api'

import { Button } from '@material-ui/core'
import { ConfigListItem } from './configListItem'

export const Configuracao = forwardRef(({ PdvId, AnxId, allowEditing, onAllowEditingChange }, ref) => {
  const [configPDV, setConfigPDV] = useState([])
  const [backupConfigPDV, setBackupConfigPDV] = useState([])
  const [configPadrao, setConfigPadrao] = useState([])
  const [produtos, setProdutos] = useState([])
  const [tiposDeVenda, setTiposDeVenda] = useState([])
  const [receitas, setReceitas] = useState([])

  useEffect(() => {
    async function LoadData() {
      const response = await api.get(`/pontosdevenda/info/${PdvId}/${AnxId}/config`)

      setConfigPDV(response.data.Dados.CfgPdv)
      setBackupConfigPDV(response.data.Dados.CfgPdv)
      setConfigPadrao(response.data.Dados.CfgPadrao)

      setProdutos(response.data.Dados.Produtos)
      setTiposDeVenda(response.data.Dados.TiposVenda)
      setReceitas(response.data.Dados.Receitas)
    }
    LoadData()
  }, [])

  useImperativeHandle(ref, () => ({

    handleSubmit() {
      if (!validConfig(configPDV)) {
        alert('configuração inválida')
        return
      }

      console.log(configPDV);

      //depois que o put der certo
      //setBackupConfigPDV(configPDV)
    },

    undoChanges() {
      setConfigPDV(backupConfigPDV)
    }

  }));

  const updateConfigPDV = (field, value, index) => {
    if (field === 'Sel' && ((!isNumeric(value) || configPDV.filter(cfg => String(cfg.Sel).trim() === value).length !== 0) && value !== '')) {
      return
    }

    if ((field === 'Valor_1' || field === 'Valor_2') && !isNumeric(value) && value !== '') {
      return
    }

    setConfigPDV(oldState => {
      let aux = [...oldState]

      aux[index][field] = value

      return aux
    })
  }

  const isNumeric = (str) => {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) && parseFloat(str) >= 0// ...and ensure strings of whitespace fail
  }

  const handleAddConfig = () => {
    setConfigPDV(oldState => {
      let aux = [...oldState]
      let arrayOrganizadoPorSel = configPDV.sort((a, b) => a.Sel - b.Sel)

      aux.push({
        Sel: arrayOrganizadoPorSel[arrayOrganizadoPorSel.length - 1].Sel + 1,
        ProdId: null,
        TipoVenda: null,
        Valor_1: 0,
        Valor_2: 0,
        RecId: null
      })

      return aux
    })
  }

  const handleRemoveConfig = (index) => {
    setConfigPDV(oldState => {
      let aux = [...oldState]

      aux.splice(index, 1)

      return aux
    })
  }

  const validConfig = (config) => {
    let isValid = false

    // for (let i = 0; i < configPDV.length; i++) {
    //   if (configPDV[i].) { }
    // }

    return isValid
  }

  return (
    <>
      <div
        style={{
          overflowY: 'auto',
          maxHeight: '380px',
          borderBottom: '8px'
        }}
      >
        {configPDV.sort((a, b) => a.Sel - b.Sel).map((cfg, index) => (
          <ConfigListItem
            key={`${cfg.Sel}${cfg.ProdId}${index}`}
            Editing={allowEditing}

            Sel={cfg.Sel}
            ProdCod={cfg.ProdId}
            TVendaId={cfg.TipoVenda}
            V1={cfg.Valor_1}
            V2={cfg.Valor_2}
            RecId={cfg.RecId}

            Produtos={produtos}
            TiposDeVenda={tiposDeVenda}
            Receitas={receitas}

            Linha={index}
            onUpdateConfig={updateConfigPDV}
            onRemoveConfig={handleRemoveConfig}
          />
        ))}
      </div>
      <Button
        onClick={handleAddConfig}
        style={{
          width: '100%',
          background: 'green',
          color: '#FFF',
          borderRadius: '20px'
        }}>
        ADICIONAR BEBIDA
      </Button>
    </>
  )
})