import {render, screen, waitFor} from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";
import DelegatedSupportCampsUI from "../DelegatedSupportCampsUI/index";
import messages from "../../../../messages";

const { labels, placeholders, validations } = messages;

const viewMoreModalVisible = true;
const isRemoveSupportModalVisible= true;
const showViewMoreModal= jest.fn();
const RemoveCardDelegatedSupportedCamps= jest.fn();
const handleSupportedCampsCancel = jest.fn();
const handelViewMoreModalCancel= jest.fn();

describe("Delegated Support camps page", ()=>{
    it("render Modal when Remove support is clicked", ()=>{
        const { getByText } = render(
            <DelegatedSupportCampsUI
                RemoveCardDelegatedSupportedCamps={RemoveCardDelegatedSupportedCamps}
                handleSupportedCampsCancel={handleSupportedCampsCancel}
                isRemoveSupportModalVisible={isRemoveSupportModalVisible}
                showViewMoreModal={showViewMoreModal}
                handelViewMoreModalCancel={handelViewMoreModalCancel}
                viewMoreModalVisible={viewMoreModalVisible}
          />
        );
        expect(getByText("Remove")).toBeTruthy();
        expect(getByText("Cancel")).toBeTruthy();
        expect(screen.getByText("Remove Support")).toBeInTheDocument();
        expect(
        screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
         ).toBeInTheDocument();
    });

    it("render Remove support is clicked", ()=>{
        render(
            <DelegatedSupportCampsUI
                RemoveCardDelegatedSupportedCamps={RemoveCardDelegatedSupportedCamps}
                handleSupportedCampsCancel={handleSupportedCampsCancel}
                isRemoveSupportModalVisible={isRemoveSupportModalVisible}
                showViewMoreModal={showViewMoreModal}
                handelViewMoreModalCancel={handelViewMoreModalCancel}
                viewMoreModalVisible={viewMoreModalVisible}
          />
        );
        expect(
        screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
         ).toBeInTheDocument();
    });
    it("render delegated Supported Camps is clicked/active", ()=>{
        render(
            <DelegatedSupportCampsUI
                RemoveCardDelegatedSupportedCamps={RemoveCardDelegatedSupportedCamps}
                handleSupportedCampsCancel={handleSupportedCampsCancel}
                isRemoveSupportModalVisible={isRemoveSupportModalVisible}
                showViewMoreModal={showViewMoreModal}
                handelViewMoreModalCancel={handelViewMoreModalCancel}
                viewMoreModalVisible={viewMoreModalVisible}
          />
        );
        expect(
            screen.getAllByText(labels.fortopics)[1] as HTMLLabelElement
             ).toBeInTheDocument();
        expect(
        screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
         ).toBeInTheDocument();
        
        expect(
         screen.getAllByText(labels.nickname)[0]).toBeInTheDocument();
        expect(
        screen.getAllByText(labels.supportdelegatedto)[0]).toBeInTheDocument();
        expect(
            screen.getAllByText(labels.currentSupportedCamps)[0]).toBeInTheDocument();
        // expect(
        //     screen.getAllByText(labels.viewMore)[0]).toBeInTheDocument();
        expect(
            screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
                ).toBeInTheDocument();
    });
    it("render View More is clicked", ()=>{
        render(
            <DelegatedSupportCampsUI
                RemoveCardDelegatedSupportedCamps={RemoveCardDelegatedSupportedCamps}
                handleSupportedCampsCancel={handleSupportedCampsCancel}
                isRemoveSupportModalVisible={isRemoveSupportModalVisible}
                showViewMoreModal={showViewMoreModal}
                handelViewMoreModalCancel={handelViewMoreModalCancel}
                viewMoreModalVisible={viewMoreModalVisible}
          />
        );
        expect(
        screen.getAllByText(labels.viewMore)[1] as HTMLLabelElement
         ).toBeInTheDocument();
    });
    it("render Modal View More is clicked", ()=>{
        render(
            <DelegatedSupportCampsUI
                RemoveCardDelegatedSupportedCamps={RemoveCardDelegatedSupportedCamps}
                handleSupportedCampsCancel={handleSupportedCampsCancel}
                isRemoveSupportModalVisible={isRemoveSupportModalVisible}
                showViewMoreModal={showViewMoreModal}
                handelViewMoreModalCancel={handelViewMoreModalCancel}
                viewMoreModalVisible={viewMoreModalVisible}
          />
        );
        expect(
        screen.getAllByText(labels.viewMore)[1] as HTMLLabelElement
         ).toBeInTheDocument();
         expect(screen.getByText("Current Supported Campus:")).toBeInTheDocument();
    });

})    