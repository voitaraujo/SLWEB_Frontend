import React, { useState } from "react";
import Loading from "../../components/loading_screen";

//Meio de comunicação
import { api } from "../../services/api";

import { Container } from "../../components/commom_in";
import { Toast } from "../../components/toasty";

// import Stepper from './stepper'
import CodeView from './codeInsertView'
import Intro from './modals/Intro'
import { HelperModal } from './modals/helperModal'

import { Form } from './Form'

import {
  Zoom,
  Fab,
} from '@material-ui/core'

import { FormContainer } from "./styles";

import {
  ContactSupport as ContactSupportIcons
} from '@material-ui/icons'

export const Formulario = () => {
  const [codCandidato, setCodCandidato] = useState(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [validado, setValidado] = useState(false)
  const [form, setForm] = useState(INITIAL_STATE)
  const [wait, setWait] = useState(false)
  const [helperModalOpen, setHelperModalOpen] = useState(false);

  const handleInsereCodigo = async (codigo, event) => {
    if (!Number.isSafeInteger(Number(codigo))) {
      event.target.value = codigo.slice(0, codigo.length - 1);
      return;
    }

    if (codigo.length === 6) {
      setCodCandidato(codigo)
      setLoading(true)
    } else {
      setCodCandidato(null)
      return;
    }

    try {
      await api.get(`/form/check/${codigo}`);
      setLoading(false)
      setValidado(true)
      setWait(false)
    } catch (err) {
      Toast('Código inválido', 'info')
      setLoading(false)
      setValidado(false)
      setWait(false)
      setCodCandidato(null)
    }
  }

  const handleChangeEmail = (value) => {
    setEmail(value)
  }

  const handleSolicitaCodigo = async () => {
    if (email === "" || email === null) {
      Toast('Informe um email', 'warn')
      return
    }

    let toastId = null

    try {
      toastId = Toast('Aguarde...', 'wait')
      setWait(true)

      await api.post("/form/solicitacao", {
        email: email,
      });

      Toast('Um código foi enviado para o seu email!', 'update', toastId, 'success')
    } catch (err) {
      Toast('Falha ao enviar email com código', 'update', toastId, 'error')
      setWait(false)
    }
  }

  // const handleSubmit = async (event) => {
  //   let shouldFinishForm = true
  //   setWait(true)

  //   //Pega todos inputs do tipo arquivos
  //   const arquivos = document.getElementsByClassName("files");

  //   //cria um objeto do tipo formulario
  //   const formData = new FormData();

  //   //poe o conteudo de todos os inputs do tipo arquivo dentro do mesmo formulario
  //   for (let j = 0; j < arquivos.length; j++) {
  //     for (let i = 0; i < arquivos[j].files.length; i++) {
  //       formData.append(`formData`, arquivos[j].files[i]);
  //     }
  //   }

  //   // if (formData.getAll('formData').length < 3) {
  //   //   Toast('Anexe todos os arquivos solicitados', 'warn')
  //   //   setWait(false)
  //   //   return false
  //   // }

  //   let toastId = null

  //   //faz upload de tudo
  //   try {
  //     toastId = Toast('Enviando dados...', 'wait')

  //     //envia o formulario
  //     await api.post(`/form/${codCandidato}`,
  //       {
  //         form: form,
  //       },
  //     );

  //     //envia os arquivos
  //     await api.post(`/form/upload/${codCandidato}/${formData.getAll('formData').length}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })

  //     Toast('Dados salvos!', 'update', toastId, 'success')
  //   } catch (err) {
  //     Toast('Falha ao salvar os dados, se o erro persistir baixe o arquivo Word e nos envie com as respostas pelo email informado no arquivo.', 'update', toastId, 'error')
  //     event.target.disabled = false
  //     shouldFinishForm = false;
  //   }

  //   if (!shouldFinishForm) {
  //     setWait(false)
  //   } else {
  //     setTimeout(() => window.location.reload(), 3000);
  //   }

  //   return shouldFinishForm
  // }

  const handleOpenHelperModal = () => {
    setHelperModalOpen(true)
  }

  const handleCloseHelperModal = () => {
    setHelperModalOpen(false)
  }

  const whichContentDisplay = () => {
    if (codCandidato === null) {
      return (
        <CodeView
          onCodeInsertion={(value, e) => handleInsereCodigo(value, e)}
          onCodeRequest={(e) => handleSolicitaCodigo(e)}
          onEmailChange={(e) => handleChangeEmail(e)}
          fetching={wait}
        />
      )
    } else if (loading) {
      return (
        <Loading
          type="spinningBubbles"
          color="#000000"
          height="3%"
          width="3%"
        />
      )
    } else if (validado) {
    return (
      <FormContainer>
        <Intro />
        <Form 
          Form={form}
          onChangeForm={setForm}
          COD={codCandidato}
        />
      </FormContainer>
    )
    } else {
      return null
    }
  }

  return (
    <>
      <HelperModal
        open={helperModalOpen}
        onClose={handleCloseHelperModal}
        title='Ajuda com o Formulário'
      />

      <Container>
        {whichContentDisplay()}
      </Container>

      <div
        style={{
          position: "fixed",
          right: "16px",
          bottom: "16px",
        }}
      >
        <Zoom
          in={!helperModalOpen}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${!helperModalOpen ? transitionDuration.exit : 0
              }ms`,
          }}
          unmountOnExit
        >
          <Fab
            onClick={handleOpenHelperModal}
            color="primary"
            style={{
              boxShadow: '2px 2px 3px #999',
              backgroundColor: '#0056C7'
            }}
          >
            <ContactSupportIcons fontSize="large" />
          </Fab>
        </Zoom>
      </div>
    </>
  );
}

export default Formulario

const INITIAL_STATE = {
  Nome_Completo: '',
  DtNascimento: null,
  RG: '',
  CPF: '',
  Logradouro: '',
  Número: '',
  Complemento: '',
  Bairro: '',
  Municipio: '',
  Estado: '',
  CEP: '',
  Email: '',
  Tel_Residencial: '',
  Celular: '',
  Est_Civil: null,
  Conj_Nome: '',
  Conj_DtNascimento: null,
  Conj_CPF: null,
  Conj_RG: null,
  TUnião: '',
  Conj_RendMensal: '',
  CLT: null,
  Tem_filhos: null,
  Qtd_filhos: '',
  Idd_filhos: '',
  T_Residencia: null,
  P_Veiculo: null,
  P_Imovel: null,
  Expect: null,
  Recolhimento: null,
  T_Empresa: null,
  Sociedade: null,
  Part_invest: null,
  T_Empreendimento: null,
  Cob_Desp: null,
  Prioridade: new Array(11),
  Com_Regra: null,
  Com_Med: null,
  Com_Inf: null,
  Rend_Mensal: null,
  Residencia_Mensal: null,
  Recolhimento_QTD: null,
  Origem_Capital: '',
  Renda_Familiar: '',
  Renda_Composta: '',
  Disp_Invest: '',
  Detalhes_Atividade: '',
  Form_Escolar: '',
  Ult_exp: '',
  Nome_Socio: null,
  Socio_Vinculo: '',
  Tempo_ConheceSocio: '',
  Realizou_Socio: '',
  Cond_Socio: '',
  Prop_Invest: null,
  Exp_Sociedade: null,
  Conhece_Pilao: '',
  Caracteristica_Peso: '',
  Consultor: ''
}

const transitionDuration = {
  appear: 300,
  enter: 300,
  exit: 300,
};