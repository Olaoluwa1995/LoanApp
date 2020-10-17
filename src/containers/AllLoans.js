import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import { adminAxios } from "../utils";
import { Card, Empty, message, Modal, Button } from "antd";
import {
  Container,
  Table,
  Transition,
  Segment,
  Loader,
  Icon,
  Form,
  Dropdown,
} from "semantic-ui-react";
import {
  userIDURL,
  allLoanListURL,
  subscriptionProductCategoryCreateURL,
  subscriptionProductCreateURL,
  subscriptionProductSubCategoryCreateURL,
  subscriptionProductCategoryListURL,
  subscriptionProductSubCategoryListURL,
} from "../constants";

class AllLoans extends React.Component {
  state = {
    loading: true,
    visible: false,
    modalVisible: false,
    categoryVisible: false,
    subCategoryVisible: false,
    productVisible: false,
    loans: [],
    categories: [],
    subCategories: [],
    userID: null,
    id: "",
    category_name: "",
    sub_category_name: "",
    category: null,
    sub_category: null,
    categoryId: "",
    subCategoryId: "",
    product_name: "",
    amount: "",
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
    this.handleFetchUserID();
    this.handleFetchAllLoans();
    this.handleFetchCategories();
    this.handleFetchSubCategories();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleFetchUserID = () => {
    adminAxios
      .get(userIDURL)
      .then((res) => {
        if (this._isMounted) {
          this.setState({ userID: res.data.userID });
        }
      })
      .catch((err) => {
        message.error(err.response.statusText);
      });
  };

  handleFetchAllLoans = () => {
    adminAxios
      .get(allLoanListURL)
      .then((res) => {
        if (this._isMounted) {
          console.log(res.data);
          this.setState({ loans: res.data });
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        message.error(err.response.statusText);
      });
  };

  handleFetchCategories = () => {
    this.setState({ loading: true });
    adminAxios
      .get(subscriptionProductCategoryListURL)
      .then((res) => {
        if (this._isMounted) {
          this.setState({
            loading: false,
            categories: res.data,
          });
          console.log(res.data);
        }
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFetchSubCategories = () => {
    this.setState({ loading: true });
    adminAxios
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

  // handleCategoryChange = (e) => {
  //   const { categoryData } = this.state;
  //   const updatedFormdata = {
  //     ...categoryData,
  //     [e.target.name]: e.target.value,
  //   };
  //   this.setState({
  //     categoryData: updatedFormdata,
  //   });
  //   console.log(categoryData);
  // };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  categoryChange = (e, { value }) => {
    const { categoryId } = this.state;
    // const CategoryId = value;
    // const Category = categories.find((category) => category.id === CategoryId);
    this.setState({
      categoryId: value,
    });
    console.log(categoryId);
  };

  subCategoryChange = (e, { value }) => {
    const { subCategoryId } = this.state;
    // const SubCategoryId = value;
    // const SubCategory = subCategories.find(
    //   (subCategory) => subCategory.id === SubCategoryId
    // );
    this.setState({
      subCategoryId: value,
    });
    console.log(subCategoryId);
  };

  // handleSubCategoryChange = (e) => {
  //   const { subCategoryData } = this.state;
  //   const updatedFormdata = {
  //     ...subCategoryData,
  //     [e.target.name]: e.target.value,
  //   };
  //   this.setState({
  //     subCategoryData: updatedFormdata,
  //   });
  //   console.log(subCategoryData);
  // };

  // handleProductChange = (e) => {
  //   const { productData } = this.state;
  //   const updatedFormdata = {
  //     ...productData,
  //     [e.target.name]: e.target.value,
  //   };
  //   this.setState({
  //     productData: updatedFormdata,
  //   });
  //   console.log(productData);
  // };

  handleCreateCategory = () => {
    const { category_name } = this.state;
    console.log(category_name);
    adminAxios
      .post(subscriptionProductCategoryCreateURL, {
        category_name,
      })
      .then((res) => {
        console.log(res.data);
        this.handleFetchCategories();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleCreateSubCategory = () => {
    const { categoryId, sub_category_name } = this.state;
    console.log(categoryId, sub_category_name);
    adminAxios
      .post(subscriptionProductSubCategoryCreateURL, {
        categoryId,
        sub_category_name,
      })
      .then((res) => {
        console.log(res.data);
        this.handleFetchSubCategories();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleCreateProduct = () => {
    const { subCategoryId, product_name, amount } = this.state;
    console.log(subCategoryId, product_name, amount);
    adminAxios
      .post(subscriptionProductCreateURL, {
        subCategoryId,
        product_name,
        amount,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  showCategoryModal = () => {
    this.setState({
      categoryVisible: true,
    });
  };

  handleCategoryCancel = () => {
    this.setState({ categoryVisible: false });
  };

  showSubCategoryModal = () => {
    this.setState({
      subCategoryVisible: true,
    });
  };

  handleSubCategoryCancel = () => {
    this.setState({ subCategoryVisible: false });
  };

  showProductModal = () => {
    this.setState({
      productVisible: true,
    });
  };

  handleProductCancel = () => {
    this.setState({ productVisible: false });
  };

  render() {
    const {
      loans,
      visible,
      modalVisible,
      categoryVisible,
      subCategoryVisible,
      productVisible,
      category_name,
      sub_category_name,
      product_name,
      amount,
      loading,
      value,
      categories,
      subCategories,
    } = this.state;

    const categoryOptions = categories.map((category) => ({
      key: category.id,
      text: category.category_name,
      value: category.id,
    }));
    const subCategoryOptions = subCategories.map((subCategory) => ({
      key: subCategory.id,
      text: subCategory.sub_category_name,
      value: subCategory.id,
    }));

    const showModal = (
      <Modal
        visible={modalVisible}
        title="Add New Product"
        onCancel={this.handleCancel}
        footer={[
          <Button shape="round" key="back" onClick={this.handleCancel}>
            Return
          </Button>,
        ]}
      >
        <Segment color="blue" onClick={this.showCategoryModal}>
          Add Category
        </Segment>
        <Segment color="blue" onClick={this.showSubCategoryModal}>
          Add Sub-category
        </Segment>
        <Segment color="blue" onClick={this.showProductModal}>
          Add Product
        </Segment>
      </Modal>
    );

    const showCategoryModal = (
      <Modal
        visible={categoryVisible}
        title="Add Category"
        onOk={this.handleCreateCategory}
        onCancel={this.handleCategoryCancel}
        footer={[
          <Button shape="round" key="back" onClick={this.handleCategoryCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            shape="round"
            icon={<Icon name="add" />}
            loading={loading}
            onClick={this.handleCreateCategory}
          >
            Create
          </Button>,
        ]}
      >
        <Form onSubmit={this.handleCreateCategory}>
          <Form.Input
            name="category_name"
            icon="folder"
            iconPosition="left"
            placeholder="Category Name"
            onChange={this.handleChange}
            value={category_name}
          />
        </Form>
      </Modal>
    );

    const showSubCategoryModal = (
      <Modal
        visible={subCategoryVisible}
        title="Add SubCategory"
        onOk={this.handleCreateSubCategory}
        onCancel={this.handleSubCategoryCancel}
        footer={[
          <Button
            shape="round"
            key="back"
            onClick={this.handleSubCategoryCancel}
          >
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            shape="round"
            icon={<Icon name="add" />}
            loading={loading}
            onClick={this.handleCreateSubCategory}
          >
            Create
          </Button>,
        ]}
      >
        <Form onSubmit={this.handleCreateSubCategory}>
          <Dropdown
            placeholder="Select category..."
            scrolling
            fluid
            clearable
            search
            selection
            onChange={this.categoryChange}
            options={categoryOptions}
            value={value}
          />
          <Form.Input
            name="sub_category_name"
            icon="folder"
            iconPosition="left"
            placeholder="Sub-Category Name"
            onChange={this.handleChange}
            value={sub_category_name}
          />
        </Form>
      </Modal>
    );

    const showProductModal = (
      <Modal
        visible={productVisible}
        title="Add Product"
        onOk={this.handleCreateProduct}
        onCancel={this.handleProductCancel}
        footer={[
          <Button shape="round" key="back" onClick={this.handleProductCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            shape="round"
            icon={<Icon name="add" />}
            loading={loading}
            onClick={this.handleCreateProduct}
          >
            Create
          </Button>,
        ]}
      >
        <Form onSubmit={this.handleCreateProduct}>
          <Dropdown
            placeholder="Select category..."
            scrolling
            fluid
            clearable
            search
            selection
            onChange={this.subCategoryChange}
            options={subCategoryOptions}
            value={value}
          />
          <Form.Input
            name="product_name"
            icon="folder"
            iconPosition="left"
            placeholder="Product Name"
            onChange={this.handleChange}
            value={product_name}
          />
          <Form.Input
            name="amount"
            icon="currency"
            iconPosition="left"
            placeholder="Amount"
            onChange={this.handleChange}
            value={amount}
          />
        </Form>
      </Modal>
    );

    const { isAdminAuthenticated } = this.props;
    if (!isAdminAuthenticated) {
      return <Redirect to="/admin-login" />;
    }

    return (
      <Transition visible={visible} animation="zoom" duration={1400}>
        <Container>
          {loading && (
            <Segment>
              <Loader size="massive">Loading Loans</Loader>
            </Segment>
          )}
          <Card
            hoverable
            style={{
              minHeight: 600,
            }}
          >
            <h1
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bolder",
              }}
            >
              User Loans
            </h1>
            <div style={{ float: "right", paddingBottom: 10 }}>
              <Button
                type="primary"
                shape="round"
                icon={<Icon name="add" />}
                size="middle"
                onClick={this.showModal}
                style={{ width: 200, marginRight: 40 }}
              >
                Add Products
              </Button>
            </div>
            {showModal}
            {showCategoryModal}
            {showSubCategoryModal}
            {showProductModal}
            {loans.length !== 0 ? (
              <Fragment>
                <Table inverted celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Product</Table.HeaderCell>
                      <Table.HeaderCell>Card</Table.HeaderCell>
                      <Table.HeaderCell>Tenure (days)</Table.HeaderCell>
                      <Table.HeaderCell>Amount (#)</Table.HeaderCell>
                      <Table.HeaderCell>Interest (%)</Table.HeaderCell>
                      <Table.HeaderCell>Due Date</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {loans.map((loan) => (
                      <Table.Row key={loan.id}>
                        <Table.Cell>
                          {
                            <Link to={`all-loans/${loan.id}`}>
                              {loan.product}
                            </Link>
                          }
                        </Table.Cell>
                        <Table.Cell>{loan.card}</Table.Cell>
                        <Table.Cell>{loan.tenure}</Table.Cell>
                        <Table.Cell>{loan.amount}</Table.Cell>
                        <Table.Cell>{loan.interest}</Table.Cell>
                        <Table.Cell>{loan.due_date}</Table.Cell>
                        <Table.Cell>{loan.status}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Fragment>
            ) : (
              <Empty style={{ marginLeft: 100 }} />
            )}
          </Card>
        </Container>
      </Transition>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAdminAuthenticated: state.adminAuth.adminToken !== null,
  };
};

export default withRouter(connect(mapStateToProps, null)(AllLoans));
