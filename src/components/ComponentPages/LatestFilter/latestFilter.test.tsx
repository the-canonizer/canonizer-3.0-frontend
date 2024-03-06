import { Provider, useSelector } from "react-redux";
import Search from ".";
import { fireEvent, render, screen, waitFor } from "../../../utils/testUtils";
import LatestFilter from ".";
import configureMockStore from "redux-mock-store";


const mockStore = configureMockStore();

const store1 =mockStore({
    utils:{
        archived_checkbox:true,
        score_checkbox:true
    }
})
const store2 =mockStore({
    utils:{
        score_checkbox:true
    }
})

const store3 =mockStore({
    filters: {
        filterObject: {
          includeReview: true,
        },
      },
})
const store4 =mockStore({
    filters: {
        filterObject: {
            asof: "bydate",
        },
      },
})
const store5 =mockStore({
    filters: {
        filterObject: {
            filterByScore: 1,
        },
      },
})

describe("Search heading", () => {
    it("render camp search heading", () => {
      render(<Provider store={store1}><LatestFilter /></Provider>);
      const SelectedFilter = screen.getByTestId("Selected filter");
      expect(SelectedFilter).toBeInTheDocument();
      const clearAll = screen.getByTestId("clear_all");
      expect(clearAll).toBeInTheDocument();
      const showArchveTag = screen.getByTestId("archived_camps");
      expect(showArchveTag).toBeInTheDocument();
      const showArchveTagCloseIcon = screen.getByTestId("close_icon_archived_camps");
      expect(showArchveTagCloseIcon).toBeInTheDocument();
      fireEvent.click(showArchveTagCloseIcon)
      fireEvent.click(clearAll)
    });
    it("render 100% score checkbox", () => {
        render(<Provider store={store2}><LatestFilter /></Provider>);
        const shwScoreCheckBox = screen.getByTestId("100%_of_canonized_score");
        expect(shwScoreCheckBox).toBeInTheDocument();
        const showArchveTagCloseIcon = screen.getByTestId("close_icon_100%_of_canonized_score");
        expect(showArchveTagCloseIcon).toBeInTheDocument();
        fireEvent.click(showArchveTagCloseIcon)
      });
      it("render include review", () => {
        render(<Provider store={store3}><LatestFilter /></Provider>);
        const shwScoreCheckBox = screen.getByTestId("include_review");
        expect(shwScoreCheckBox).toBeInTheDocument();
        const showArchveTagCloseIcon = screen.getByTestId("close_icon_include_review");
        expect(showArchveTagCloseIcon).toBeInTheDocument();
        fireEvent.click(showArchveTagCloseIcon)
      });

      it("render as of date", () => {
        render(<Provider store={store4}><LatestFilter /></Provider>);
        const shwScoreCheckBox = screen.getByTestId("asOfDate");
        expect(shwScoreCheckBox).toBeInTheDocument();
        const showArchveTagCloseIcon = screen.getByTestId("close_icon_as_of_date");
        expect(showArchveTagCloseIcon).toBeInTheDocument();
        fireEvent.click(showArchveTagCloseIcon)
      });
      it("render as score filter", () => {
        render(<Provider store={store5}><LatestFilter /></Provider>);
        const shwScoreCheckBox = screen.getByTestId("Score");
        expect(shwScoreCheckBox).toBeInTheDocument();
        const showArchveTagCloseIcon = screen.getByTestId("close_icon_Score");
        expect(showArchveTagCloseIcon).toBeInTheDocument();
        fireEvent.click(showArchveTagCloseIcon)
      });
      
  });