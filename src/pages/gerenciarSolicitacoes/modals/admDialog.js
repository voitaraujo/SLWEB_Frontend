import React, { useState } from "react";
import { api } from "../../../services/api";
import Draggable from "react-draggable";

import { Settings, Check, Close } from "@material-ui/icons/";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Typography,
  TextField
} from "@material-ui/core";

import Button from "../../../components/materialComponents/Button";
import { roleLevel, convertData } from "../../../misc/commom_functions";
import {
  REACT_APP_SISTEMA_ROLE_LEVEL,
  REACT_APP_BACKOFFICE_ROLE_LEVEL,
  REACT_APP_TECNICA_ROLE_LEVEL,
  REACT_APP_EXPEDICAO_ROLE_LEVEL,
  REACT_APP_FRANQUEADO_ROLE_LEVEL,
} from "../../../misc/role_levels";
import { Toast } from "../../../components/toasty";
import { RED_SECONDARY, GREY_SECONDARY } from "../../../misc/colors";
import DatePicker from "../../../components/materialComponents/datePicker";

function PaperComponent(props) {
  return (
    <Draggable
      {...props}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
function DraggableDialog(props) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(null);
  const [rejectReason, setReject] = useState("");
  const [prevDate, setPrev] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [wait, setWait] = useState(false);

  const { Req } = props;

  const handleClickOpen = async () => {
    setStage(CheckStage(Req));
    setOpen(true);
    try {
      await api.put("/equip/requests/check", {
        ID: Req.OSCId,
      });
    } catch (err) { }
  };

  const handleClose = () => {
    setOpen(false);
    setReject("");
    setPrev(null);
  };

  const handleManagement = async (action) => {
    setWait(true);
    let toastId = null

    try {
      toastId = Toast('Aguarde...', 'wait')
      await api.put("/equip/requests/validate", {
        OSID: Req.OSCId,
        action: action,
        reject: rejectReason,
        prev: prevDate,
      });

      Toast('Atualiza????o gravada', 'update', toastId, 'success')
      setUpdated(true);
      handleClose();
    } catch (err) {
      setWait(false);
    }
  };

  const updateDate = (date) => {
    date instanceof Date && !isNaN(date) ? setPrev(date) : setPrev(null);
  };

  const SUDO = async (action) => {
    setWait(true);
    let toastId = null

    try {
      toastId = Toast('Aguarde...', 'wait')
      await api.put("/equip/requests/admin", {
        OSID: Req.OSCId,
        action,
      });

      Toast('Atualiza????o gravada com sucesso!', 'update', toastId, 'success')
      setWait(false);
    } catch (err) {
      setWait(false);
      Toast('Falha ao gravar atualiza????o', 'update', toastId, 'error')
    }
  };

  return (
    <div>
      <Button
        disabled={updated}
        style={{
          color: `${updated ? "#CCCCCC" : RED_SECONDARY}`,
          border: `1px solid ${updated ? "#CCCCCC" : RED_SECONDARY}`,
        }}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        <Settings />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          GERENCIAMENTO DE SOLICITA????O
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Status: </strong>
            {showStatus(stage)}
          </DialogContentText>
          {ShowControlls(
            stage,
            Req,
            rejectReason,
            setReject,
            prevDate,
            updateDate,
            handleManagement,
            wait,
            SUDO
          )}
        </DialogContent>
        <DialogActions style={{ padding: '8px 24px' }}>
          <Button
            style={{
              color: `${wait ? "#CCCCCC" : RED_SECONDARY}`,
              border: `1px solid ${wait ? "#CCCCCC" : RED_SECONDARY}`,
            }}
            disabled={wait}
            onClick={handleClose}
            color="primary"
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DraggableDialog;

const CheckStage = (requisicao) => {
  if (requisicao.OSCStatus === "Concluido") {
    //pedido concluido
    return 0;
  } else if (
    requisicao.OSCComDtValida????o === null &&
    requisicao.OSCStatus === "Ativo"
  ) {
    //aguardando aprova????o comercial
    return 1;
  } else if (
    requisicao.OSCComDtValida????o !== null &&
    requisicao.OSCComAceite === false
  ) {
    //negado pelo comercial
    return -1;
  } else if (
    requisicao.OSCTecDtValida????o === null &&
    requisicao.OSCStatus === "Ativo"
  ) {
    //aguardando aprova????o t??cnica
    return 2;
  } else if (
    requisicao.OSCTecDtValida????o !== null &&
    requisicao.OSCTecAceite === false
  ) {
    //negado pela t??cnica
    return -2;
  } else if (
    requisicao.OSCExpDtPrevisao === null &&
    requisicao.OSCStatus === "Ativo"
  ) {
    //aguardando previs??o de entrega da expedi????o
    return 3;
  } else if (
    requisicao.OSCExpDtPrevisao !== null &&
    requisicao.OSCStatus === "Ativo"
  ) {
    //aguardando previs??o de entrega da expedi????o
    return -3;
  } else if (requisicao.OSCStatus === "Cancelado") {
    //pedido cancelado pelo usu??rio
    return 4;
  } else {
    //s?? Deus sabe quando vai cair aqui, provavelmente se mecherem manualmente na OSCtrl
    return 9;
  }
};

const ShowControlls = (
  stage,
  Req,
  rejectReason,
  setReject,
  prevDate,
  updateDate,
  handleManagement,
  wait,
  SUDO
) => {
  if (roleLevel() === REACT_APP_SISTEMA_ROLE_LEVEL) {
    //Superuser
    return (
      <div
        className="XAlign"
        style={{
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <div className="YAlign" style={{ width: "100%", marginRight: "8px" }}>
          <Button
            disabled={wait}
            style={{
              backgroundColor: wait ? "#CCC" : GREY_SECONDARY,
              color: "#FFFFFF",
              borderBottom: "8px",
              width: "100%",
              marginBottom: "8px",
              whiteSpace: "nowrap",
            }}
            onClick={() => SUDO("RC")}
          >
            Remover Comercial
          </Button>
          <Button
            disabled={wait}
            style={{
              backgroundColor: wait ? "#CCC" : GREY_SECONDARY,
              color: "#FFFFFF",
              borderBottom: "8px",
              width: "100%",
              marginBottom: "8px",
              whiteSpace: "nowrap",
            }}
            onClick={() => SUDO("RT")}
          >
            Remover T??cnica
          </Button>
          <Button
            disabled={wait}
            style={{
              backgroundColor: wait ? "#CCC" : GREY_SECONDARY,
              color: "#FFFFFF",
              borderBottom: "8px",
              width: "100%",
              marginBottom: "8px",
              whiteSpace: "nowrap",
            }}
            onClick={() => SUDO("RE")}
          >
            Remover Expedi????o
          </Button>
        </div>
        <div className="YAlign" style={{ width: "100%" }}>
          <Button
            disabled={wait}
            style={{
              backgroundColor: wait ? "#CCC" : GREY_SECONDARY,
              color: "#FFFFFF",
              borderBottom: "8px",
              width: "100%",
              marginBottom: "8px",
              whiteSpace: "nowrap",
            }}
            onClick={() => SUDO("Cancelar")}
          >
            Cancelar OS
          </Button>
          <Button
            disabled={wait}
            style={{
              backgroundColor: wait ? "#CCC" : GREY_SECONDARY,
              color: "#FFFFFF",
              borderBottom: "8px",
              width: "100%",
              marginBottom: "8px",
              whiteSpace: "nowrap",
            }}
            onClick={() => SUDO("Concluir")}
          >
            Concluir OS
          </Button>
          <Button
            disabled={wait}
            style={{
              backgroundColor: wait ? "#CCC" : GREY_SECONDARY,
              color: "#FFFFFF",
              borderBottom: "8px",
              width: "100%",
              marginBottom: "8px",
              whiteSpace: "nowrap",
            }}
            onClick={() => SUDO("Ativar")}
          >
            Ativar OS
          </Button>
        </div>
      </div>
    );
  } else if (stage === 4 || stage === 0) {
    //Qualquer um
    return (
      <Typography>
        N??o ?? possivel gerenciar uma solicita????o que j?? foi{" "}
        <strong>Cancelada</strong> ou <strong>Conclu??da.</strong>
      </Typography>
    );
  } else if (roleLevel() === REACT_APP_FRANQUEADO_ROLE_LEVEL) {
    //Franqueado
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <div
          className="YAlign"
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Button
            disabled={wait}
            style={{
              margin: "0px 0px 8px 0px",
              width: "100%",
              border: "1px solid #000",
            }}
            onClick={() => handleManagement("accept")}
          >
            <Check />
            Confirmar Recebimento
          </Button>

          <Button
            style={{ width: "100%", border: "1px solid #000" }}
            disabled={wait}
            onClick={() => handleManagement("reject")}
          >
            <Close />
            Cancelar OS
          </Button>
        </div>
      </div>
    );
  } else if (roleLevel() === REACT_APP_BACKOFFICE_ROLE_LEVEL && stage === 1) {
    //Comercial
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <div
          className="YAlign"
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Button
            disabled={wait}
            style={{
              margin: "0px 0px 8px 0px",
              border: !wait ? "1px solid #000" : "1px solid #CCC",
            }}
            onClick={(e) => handleManagement("accept")}
          >
            <Check />
            Aceitar OS
          </Button>
        </div>

        <div
          className="XAlign"
          style={{
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <TextField
            id="standard-basic"
            label="Motivo"
            onChange={(e) => setReject(e.target.value)}
            style={{
              margin: "0px 8px 0px 0px",
              width: "170px",
              borderBottom: "1px solid #AAA",
            }}
          />
          <Button
            style={{
              border:
                rejectReason !== "" && !wait
                  ? "1px solid #000"
                  : "1px solid #CCC",
            }}
            disabled={rejectReason !== "" && !wait ? false : true}
            onClick={(e) => handleManagement("reject")}
          >
            <Close />
            Rejeitar OS
          </Button>
        </div>
      </div>
    );
  } else if (roleLevel() === REACT_APP_TECNICA_ROLE_LEVEL && stage === 2) {
    //T??cnica
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <div
          className="YAlign"
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <div
            className="XAlign"
            style={{
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <DatePicker
              label="Data Estimada"
              onChange={(e) => updateDate(e._d)}
            />
            <Button
              style={{
                marginBottom: "8px",
                border:
                  prevDate !== null && !wait
                    ? "1px solid #000"
                    : "1px solid #CCC",
              }}
              disabled={prevDate !== null && !wait ? false : true}
              onClick={(e) => handleManagement("accept")}
            >
              <Check />
              Aceitar OS
            </Button>
          </div>

          <label style={{ all: "unset" }}>
            Data esperada: {convertData(Req.OSCDtPretendida)}
          </label>
        </div>

        <div
          className="XAlign"
          style={{
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <TextField
            id="standard-basic"
            label="Motivo"
            onChange={(e) => setReject(e.target.value)}
            style={{
              margin: "0px 8px 0px 0px",
              width: "170px",
              borderBottom: "1px solid #AAA",
            }}
          />
          <Button
            style={{
              border:
                rejectReason !== "" && !wait
                  ? "1px solid #000"
                  : "1px solid #CCC",
            }}
            disabled={rejectReason !== "" && !wait ? false : true}
            onClick={(e) => handleManagement("reject")}
          >
            <Close />
            Rejeitar OS
          </Button>
        </div>
      </div>
    );
  } else if (roleLevel() === REACT_APP_EXPEDICAO_ROLE_LEVEL && stage === 3) {
    //Expedi????o
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <div
          className="YAlign"
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <div
            className="XAlign"
            style={{
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <DatePicker
              label="Data Estimada"
              onChange={(e) => updateDate(e._d)}
            />
            <Button
              style={{
                marginBottom: "8px",
                border:
                  prevDate !== null && !wait
                    ? "1px solid #000"
                    : "1px solid #CCC",
              }}
              disabled={prevDate !== null && !wait ? false : true}
              onClick={(e) => handleManagement("accept")}
            >
              <Check />
              Gravar
            </Button>
          </div>

          <label style={{ all: "unset" }}>
            Data esperada: {convertData(Req.OSCDtPretendida)}
          </label>
        </div>
      </div>
    );
  } else {
    return (
      <Typography>
        Voc?? n??o pode gerenciar essa solicita????o no momento
      </Typography>
    );
  }
};

const showStatus = (stage) => {
  switch (stage) {
    case 0:
      return "Solicita????o conclu??da";
    case 1:
      return "Solicita????o aguarda valida????o comercial";
    case -1:
      return "Solicita????o rejeitada pelo departamento comercial";
    case 2:
      return "Solicita????o aguarda valida????o t??cnica";
    case -2:
      return "Solicita????o rejeitada pelo departamento t??cnico";
    case 3:
      return "Solicita????o aguarda previs??o de entrega da logistica";
    case -3:
      return "Solicita????o em fase de prepara????o e transporte";
    case 4:
      return "Solicita????o cancelada pelo franqueado";
    default:
      return "Desconhecido";
  }
};
