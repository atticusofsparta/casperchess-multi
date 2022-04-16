import "./styles.loading.css";
import React from "react";
import Modal from "../modal components/Modal";
import ModalBody from "../modal components/ModalBody";
import ModalHeader from "../modal components/ModalHeader";
import ModalFooter from "../modal components/ModalFooter";
import CloseModal from "../modal components/CloseModal";
import ModalService from "../modal components/ModalService";

export default function LoadingModal(props) {
    ModalService.popped = true
  return (
    <Modal>
      <ModalHeader>
        <h3 className="loadingHeader">Join Lobby</h3>
      </ModalHeader>
      <ModalBody>
        <div>Available lobbies:</div>
        <div id="lobbylist">Can't find any lobbies, sorry.</div>
      </ModalBody>
      <ModalFooter>
        <div id="joinCancelFooter">
        <button className="btn btn-primary" id="joinLoadingModal">Join</button>
      <button onClick={()=> CloseModal() } className="btn btn-primary">Cancel</button>
      </div>
           </ModalFooter>
    </Modal>
  );
}