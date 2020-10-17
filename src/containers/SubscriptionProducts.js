import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  subscriptionProductCategoryListURL,
  subscriptionProductListURL,
  subscriptionProductSubCategoryListURL,
  tenureListURL,
  userIDURL,
  loanURL,
} from "../constants";
import { authAxios } from "../utils";
import {
  Dropdown,
  Container,
  Form,
  Transition,
  Icon,
  Segment,
} from "semantic-ui-react";
import { Card, Button, message } from "antd";
import { fetchCard } from "../store/actions/card";

const defaultProductCategory = "Select Category ...";
const defaultProductSubCategory = "Select SubCategory ...";
const defaultProduct = "Select Product ...";
const defaultTenure = "Select Tenure ...";

class SubscriptionProducts extends React.Component {
  state = {
    category: null,
    subCategory: null,
    product: null,
    tenure: null,
    submittedTenure: null,
    submittedProduct: null,
    userID: null,
    UserID: null,
    products: [],
    subCategories: [],
    subCategoriesArray: [],
    productsArray: [],
    categories: [],
    tenures: [],
    loading: false,
    visible: false,
    sub_category_visible: true,
    product_visible: true,
    tenure_visible: true,
    error: null,
  };

  componentDidMount() {
    this._isMounted = true;
    setTimeout(
      function () {
        if (this._isMounted) {
          this.setState({ visible: true });
        }
      }.bind(this),
      300
    );
    this.handleFetchCategories();
    this.handleFetchSubCategories();
    this.handleFetchProducts();
    this.handleFetchUserID();
    this.handleFetchTenures();
    this.props.fetchCard();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleFetchUserID = () => {
    authAxios
      .get(userIDURL)
      .then((res) => {
        if (this._isMounted) {
          this.setState({ userID: res.data.userID });
        }
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleFetchCategories = () => {
    this.setState({ loading: true });
    authAxios
      .get(subscriptionProductCategoryListURL)
      .then((res) => {
        if (this._isMounted) {
          this.setState({
            loading: false,
            categories: res.data,
          });
        }
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFetchSubCategories = () => {
    this.setState({ loading: true });
    authAxios
      .get(subscriptionProductSubCategoryListURL)
      .then((res) => {
        if (this._isMounted) {
          this.setState({
            loading: false,
            subCategories: res.data,
          });
        }
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFetchProducts = () => {
    this.setState({ loading: true });
    authAxios
      .get(subscriptionProductListURL)
      .then((res) => {
        if (this._isMounted) {
          this.setState({
            loading: false,
            products: res.data,
          });
        }
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFetchTenures = () => {
    this.setState({ loading: true });
    authAxios
      .get(tenureListURL)
      .then((res) => {
        if (this._isMounted) {
          this.setState({
            loading: false,
            tenures: res.data,
          });
        }
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  subCategoryToggleVisibility = () =>
    this.setState((prevState) => ({
      sub_category_visible: !prevState.sub_category_visible,
    }));

  productToggleVisibility = () =>
    this.setState((prevState) => ({
      product_visible: !prevState.product_visible,
    }));

  tenureToggleVisibility = () =>
    this.setState((prevState) => ({
      tenure_visible: !prevState.tenure_visible,
    }));

  categoryChange = (e, { value }) => {
    const { categories, subCategories } = this.state;
    const CategoryId = value;
    const Category = categories.find((category) => category.id === CategoryId);
    const SubCategoriesArray = subCategories.filter(
      (subCategory) => subCategory.category.id === CategoryId
    );
    this.setState({
      category: Category,
      subCategoriesArray: SubCategoriesArray,
      subCategory: null,
      product: null,
    });
    this.subCategoryToggleVisibility();
  };

  subCategoryChange = (e, { value }) => {
    const { subCategories, products } = this.state;
    const SubCategoryId = value;
    const SubCategory = subCategories.find(
      (subCategory) => subCategory.id === SubCategoryId
    );
    const ProductsArray = products.filter(
      (product) => product.sub_category.id === SubCategoryId
    );
    this.setState({
      subCategory: SubCategory,
      productsArray: ProductsArray,
      product: null,
    });
    this.productToggleVisibility();
  };

  productChange = (e, { value }) => {
    const { products } = this.state;
    const productId = value;
    const Product = products.find((product) => product.id === productId);
    this.setState({ product: Product });
    this.tenureToggleVisibility();
  };

  tenureChange = (e, { value }) => {
    const { tenures } = this.state;
    const tenureId = value;
    const Tenure = tenures.find((tenure) => tenure.id === tenureId);
    this.setState({ tenure: Tenure });
  };

  handleSubmit = () => {
    const { product, userID, tenure } = this.state;
    const ProductId = product.id;
    const TenureId = tenure.id;
    authAxios
      .post(loanURL, { ProductId, userID, TenureId })
      .then((res) => {
        message.success("successfully applied");
        this.setState({
          category: "",
          subCategory: "",
          product: "",
          tenure: "",
        });
        this.props.history.push("/");
      })
      .catch((err) => {
        message.error(`${JSON.stringify(err.response.data.message)}`);
      });
  };

  render() {
    const {
      categories,
      subCategoriesArray,
      productsArray,
      category,
      subCategory,
      value,
      product,
      tenure,
      tenures,
      visible,
      sub_category_visible,
      product_visible,
      tenure_visible,
    } = this.state;

    const { isAuthenticated, card } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (card === null) {
      return <Redirect to="/card-payment" />;
    }

    const categoryOptions = categories.map((category) => ({
      key: category.id,
      text: category.category_name,
      value: category.id,
      image: { avatar: true, src: category.icon },
    }));
    const subCategoryOptions = subCategoriesArray.map((subCategory) => ({
      key: subCategory.id,
      text: subCategory.sub_category_name,
      value: subCategory.id,
      image: { avatar: true, src: subCategory.icon },
    }));
    const productOptions = productsArray.map((product) => ({
      key: product.id,
      text: `${product.product_name} ${product.amount}`,
      value: product.id,
      image: { avatar: true, src: product.icon },
    }));
    const tenureOptions = tenures.map((tenure) => ({
      key: tenure.id,
      text: `${tenure.duration} days with ${tenure.interest}% interest rate`,
      value: tenure.id,
    }));

    const hasCategory = category && category !== defaultProductCategory;
    const hasSubCategory =
      subCategory && subCategory !== defaultProductSubCategory;
    const hasProduct = product && product !== defaultProduct;
    const hasTenure = tenure && tenure !== defaultTenure;

    return (
      <Transition visible={visible} animation="zoom" duration={1400}>
        <Container>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <Card
              hoverable
              style={{
                width: 500,
                minHeight: 500,
              }}
            >
              <h3
                style={{
                  textAlign: "center",
                  color: "#1890ff",
                }}
              >
                Choose a product and apply
              </h3>
              <Form onSubmit={this.handleSubmit} style={{ paddingTop: 20 }}>
                <Segment color="blue">
                  <Form.Field>
                    <p style={{ marginBottom: 5 }}>Category</p>
                    <Dropdown
                      placeholder="Select category..."
                      scrolling
                      clearable
                      search
                      fluid
                      selection
                      options={categoryOptions}
                      onChange={this.categoryChange}
                      value={value}
                    />
                  </Form.Field>
                </Segment>
                <Segment color="blue">
                  <Form.Field className="form-field">
                    <p style={{ marginBottom: 5 }}>Sub-Category</p>
                    <Transition
                      animation="jiggle"
                      duration={800}
                      visible={sub_category_visible}
                    >
                      <Dropdown
                        placeholder="Select sub-category..."
                        disabled={!hasCategory}
                        scrolling
                        fluid
                        clearable
                        search
                        selection
                        onChange={this.subCategoryChange}
                        options={subCategoryOptions}
                        value={value}
                      />
                    </Transition>
                  </Form.Field>
                </Segment>
                <Segment color="blue">
                  <Form.Field className="form-field">
                    <p style={{ marginBottom: 5 }}>Product</p>
                    <Transition
                      animation="jiggle"
                      duration={800}
                      visible={product_visible}
                    >
                      <Dropdown
                        placeholder="Select product..."
                        disabled={!hasSubCategory}
                        scrolling
                        fluid
                        clearable
                        search
                        selection
                        onChange={this.productChange}
                        options={productOptions}
                        value={value}
                      />
                    </Transition>
                  </Form.Field>
                </Segment>
                <Segment color="blue">
                  <Form.Field className="form-field">
                    <p style={{ marginBottom: 5 }}>Tenure</p>
                    <Transition
                      animation="jiggle"
                      duration={800}
                      visible={tenure_visible}
                    >
                      <Dropdown
                        placeholder="Select tenure..."
                        disabled={!hasProduct}
                        scrolling
                        fluid
                        clearable
                        search
                        selection
                        onChange={this.tenureChange}
                        options={tenureOptions}
                        value={value}
                      />
                    </Transition>
                  </Form.Field>
                </Segment>
                <div style={{ float: "right", marginTop: 20 }}>
                  <Button
                    disabled={!hasTenure}
                    type="primary"
                    shape="round"
                    icon={<Icon name="send" />}
                    size="middle"
                    style={{ width: 200, marginRight: 40 }}
                    onClick={this.handleSubmit}
                  >
                    Apply
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </Container>
      </Transition>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    card: state.card.userCard,
    loading: state.card.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCard: () => dispatch(fetchCard()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionProducts);
