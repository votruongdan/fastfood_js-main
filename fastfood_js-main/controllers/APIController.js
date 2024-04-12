const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Information = require('../models/Information');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const {
  isValidEmail,
  isStrongPassword,
  hashPassword,
  comparePasswords,
  generateToken,
  verifyToken,
} = require('../helpers');
class APIController {
  Index(req, res) {}
  async Products(req, res) {
    try {
      const products = await Product.find({ is_delete: false })
        .populate('category')
        .exec();

      res.json({
        success: true,
        products,
      });
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
  async Categories(req, res) {
    try {
      const categories = await Category.find({ is_delete: false });
      res.json({
        success: true,
        categories,
      });
    } catch (error) {
      console.error('Lỗi khi lấy thể loại:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }

  async Product(req, res) {
    try {
      const { id } = req.query;
      const product = await Product.findOne({ _id: id, is_delete: false })
        .populate('category')
        .exec();

      if (!product) {
        return res.json({
          success: false,
          message: 'Không tìm thấy sản phẩm.',
        });
      }
      res.json({
        success: true,
        product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi tìm kiếm sản phẩm.',
      });
    }
  }
  async Category(req, res) {
    try {
      const { id } = req.query;
      const category = await Category.findOne({ _id: id, is_delete: false });

      if (!category) {
        return res.json({
          success: false,
          message: 'Không tìm thấy category.',
        });
      }
      res.json({
        success: true,
        category,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi.',
      });
    }
  }

  async removeProduct(req, res) {
    try {
      const { id } = req.body;
      const product = await Product.findOne({ _id: id })
        .populate('category')
        .exec();

      if (!product) {
        return res.json({
          success: false,
          message: 'Không tìm thấy sản phẩm.',
        });
      }
      product.is_delete = true;
      await product.save();
      res.json({
        success: true,
        message: 'Đã xóa thành công ' + product.name + '.',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi tìm kiếm sản phẩm.',
      });
    }
  }
  async removeCategory(req, res) {
    try {
      const { id } = req.body;
      const category = await Category.findOne({ _id: id });

      if (!category) {
        return res.json({
          success: false,
          message: 'Không tìm thấy thể loại.',
        });
      }
      category.is_delete = true;
      await category.save();
      res.json({
        success: true,
        message: 'Đã xóa thành công ' + category.name + '.',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi.',
      });
    }
  }

  async updateCategory(req, res) {
    try {
      let { id, name } = req.body;
      name = name.trim();
      if (!name) {
        return res.json({
          success: false,
          message: 'Vui lòng điền Category Name.',
        });
      }
      if (id) {
        let category = await Category.findOne({ _id: id });
        category.name = name;
        await category.save();
        return res.json({
          success: true,
          message: 'Sửa thành công ' + category.name + '.',
        });
      } else {
        let newCategory = new Category({
          name: name,
        });
        await newCategory.save();
        return res.json({
          success: true,
          message: 'Thêm thành công ' + newCategory.name + '.',
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }

  async updateProduct(req, res) {
    try {
      // let { id, name, quantity, price, category, desc } = req.body;
      let id = req.body.id || '';
      let name = req.body.name || '';
      let quantity = req.body.quantity || '';
      let price = req.body.price || '';
      let category = req.body.category || '';
      let description = req.body.description || '';

      name = name.trim();
      quantity = quantity.trim();
      price = price.trim();
      description = description.trim();
      if (!name || !quantity || !price || !description) {
        return res.json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin.',
        });
      }
      if (isNaN(quantity) || isNaN(price)) {
        return res.json({
          success: false,
          message: 'Quantity và price phải là số.',
        });
      }
      if (category == '0') {
        return res.json({
          success: false,
          message: 'Hãy chọn category.',
        });
      }
      if (id == 'null') {
        if (!req.file) {
          return res.json({
            success: false,
            message: 'Hãy tải hình ảnh lên.',
          });
        }
        let newProd = new Product({
          name: name,
          img: req.file.filename,
          price: price,
          quantity: quantity,
          desc: description,
          category: category,
        });
        await newProd.save();
      } else {
        let prod = await Product.findOne({ _id: id });
        if (req.file) {
          prod.img = req.file.filename;
        }
        prod.name = name;
        prod.price = price;
        prod.quantity = quantity;
        prod.desc = description;
        prod.category = category;
        await prod.save();
      }

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }

  async Cart(req, res) {
    const cart = req.cookies.cart || {};
    const products = [];
    for (const id in cart) {
      const quantity = cart[id];
      const prod = await Product.findOne({ _id: id, is_delete: false })
        .populate('category')
        .exec();
      if (prod) {
        products.push({
          _id: prod._id,
          name: prod.name,
          img: prod.img,
          price: prod.price,
          quantity: quantity,
          category: prod.category.name,
          desc: prod.desc,
        });
      }
    }

    res.json({
      success: true,
      cart: products,
    });
  }

  countCart(req, res) {
    const cart = req.cookies.cart || {};
    res.json({
      success: true,
      total: Object.keys(cart).length,
    });
  }

  addToCart(req, res) {
    let cart = req.cookies.cart || {};
    const { id, quantity } = req.query;
    if (cart[id]) {
      if (quantity) {
        cart[id] = quantity > 0 ? quantity : 1;
      } else {
        cart[id]++;
      }
    } else {
      cart[id] = 1;
    }
    res.cookie('cart', cart);
    res.json({
      success: true,
      message: 'Thêm vào giỏ hàng thành công.',
    });
  }

  removeFromCart(req, res) {
    let cart = req.cookies.cart || {};
    const { id } = req.query;
    if (id) {
      if (cart[id]) {
        delete cart[id];
      }
      res.cookie('cart', cart);
      return res.json({
        success: true,
        message: 'Xóa thành công khỏi giỏ hàng',
      });
    } else {
      return res.json({
        success: false,
        message: 'Xóa thất bại',
      });
    }
  }

  clearCart(req, res) {
    res.cookie('cart', {});
    res.json({
      success: true,
    });
  }
  async Checkout(req, res) {
    const token = req.cookies.token;
    const phoneNumberRegex = /^\d{10}$/;
    let idUser = null;
    let cart = req.cookies.cart || {};
    let { idInfor, last_name, first_name, phone_number, address } = req.body;
    last_name = last_name.trim() || '';
    first_name = first_name.trim() || '';
    phone_number = phone_number.trim() || '';
    address = address.trim() || '';
    if (Object.keys(cart).length === 0) {
      return res.json({
        success: false,
        type: 'info',
        message: 'Hãy thêm gì đó vào giỏ hàng.',
      });
    }
    if (!first_name || !last_name || !phone_number || !address) {
      return res.json({
        success: false,
        type: 'info',
        message: 'Điền đầy đủ thông tin giao hàng.',
      });
    }
    if (!phoneNumberRegex.test(phone_number)) {
      return res.json({
        success: false,
        type: 'info',
        message: 'Số điện thoại không hợp lệ. Vui lòng nhập lại.',
      });
    }
    if (token) {
      try {
        const data = verifyToken(token);
        idUser = data._id;
        if (!idInfor) {
          let newInfor = new Information({
            user: idUser,
            phone_number: phone_number,
            address: address,
          });
          await newInfor.save();
        }
      } catch (error) {
        console.error(error);
        return res.json({ success: false, type: 'error', message: '' });
      }
    }
    try {
      let products = {};
      let total = 0;
      for (const id in cart) {
        const prod = await Product.findOne({ _id: id });
        if (prod) {
          products[id] = prod;
          total += prod.price * cart[id];
        }
      }
      let newOrder = new Order({
        user: idUser,
        total: total,
        content:
          first_name + ' ' + last_name + ' - ' + phone_number + ' - ' + address,
      });
      const order = await newOrder.save();
      for (const id in cart) {
        if (products[id]) {
          let newDetail = new OrderDetail({
            order: order._id,
            product: products[id]._id,
            quantity: cart[id],
            price: products[id].price,
          });
          await newDetail.save();
        }
      }
      res.cookie('cart', {});
      res.json({
        success: true,
        type: 'success',
        message: 'Đã đặt hàng thành công.',
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        type: 'error',
        message: 'Đã xảy ra lỗi khi đặt hàng.',
      });
    }
  }

  async Orders(req, res) {
    try {
      const pageSize = 5;
      const { searchKey, page } = req.query;

      const orders = await Order.find({
        content: { $regex: searchKey, $options: 'i' },
      });
      res.json({
        success: true,
        orders: orders.map((order) => ({
          id: order._id,
          name: order.content.split('-')[0].trim(),
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
        })),
      });
    } catch (error) {
      console.error(error);
      res.json({ success: false });
    }
  }

  async orderDetail(req, res) {
    try {
      const { id } = req.query;
      const detail = await OrderDetail.find({ order: id })
        .populate('order')
        .populate('product')
        .exec();
      if (detail) {
        res.json({ success: true, detail: detail });
      } else {
        res.json({
          success: false,
          message: 'Không tìm thấy chi tiết đơn hàng.',
        });
      }
    } catch (error) {
      console.error(error);
      res.json({ success: false });
    }
  }

  async Register(req, res) {
    let { first_name, last_name, email, password } = req.body;

    first_name = first_name.trim();
    last_name = last_name.trim();
    email = email.trim();

    if (!first_name || !last_name || !email || !password) {
      return res.json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin.',
      });
    }
    if (!isStrongPassword(password)) {
      return res.json({
        success: false,
        message: 'Mật khẩu yếu.',
      });
    }
    if (!isValidEmail(email)) {
      return res.json({
        success: false,
        message: 'Email không hợp lệ.',
      });
    }
    try {
      const hashedPassword = await hashPassword(password);

      const newUser = new User({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
      });
      await newUser.save();

      return res.json({
        success: true,
        message: 'Đăng ký thành công.',
      });
    } catch (error) {
      console.error(error);
      // Nếu có lỗi xảy ra, trả về thông báo lỗi
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi đăng ký: ' + error.message,
      });
    }
  }

  async Login(req, res) {
    let { email, password } = req.body;
    email = email.trim();

    if (!email || !password) {
      return res.json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin.',
      });
    }
    if (!isValidEmail(email)) {
      return res.json({
        success: false,
        message: 'Email không hợp lệ.',
      });
    }
    try {
      // Tìm người dùng trong cơ sở dữ liệu
      const user = await User.findOne({ email });

      if (user) {
        // So sánh mật khẩu
        const passwordMatch = await comparePasswords(password, user.password);

        if (passwordMatch) {
          const token = generateToken(user._id);
          res.cookie('token', token, {
            maxAge: 1 * 60 * 60 * 1000,
            httpOnly: true,
          });
          return res.json({
            success: true,
            message: 'Đăng nhập thành công.',
          });
        }
      }
      return res.json({
        success: false,
        message: 'Tài khoản, mật khẩu không chính xác.',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi.',
        error: error.message,
      });
    }
  }
  async getNameUser(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: 'Token không tồn tại.' });
    }

    try {
      const data = verifyToken(token);
      const user = await User.findOne({ _id: data._id });
      if (!user) {
        return res.json({
          success: false,
          message: 'Không tìm thấy người dùng.',
        });
      }
      res.json({
        success: true,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      });
    } catch (error) {
      res.json({ success: false, message: 'Token không hợp lệ.' });
    }
  }
  async getUser(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: 'Token không tồn tại.' });
    }

    try {
      const data = verifyToken(token);
      const user = await User.findOne({ _id: data._id });
      if (!user) {
        return res.json({
          success: false,
          message: 'Không tìm thấy người dùng.',
        });
      }
      res.json({
        success: true,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    } catch (error) {
      res.json({ success: false, message: 'Token không hợp lệ.' });
    }
  }

  async Infor(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: 'Bạn cần phải đăng nhập.' });
    }

    try {
      const data = verifyToken(token);
      const infor = await Information.findOne({ user: data._id }).sort({
        createdAt: -1,
      });
      if (!infor) {
        return res.json({
          success: false,
          message: 'Bạn chưa từng đặt hàng trước đó.',
        });
      }
      res.json({
        success: true,
        infor,
      });
    } catch (error) {
      res.json({ success: false, message: 'Không tìm thấy người dùng.' });
    }
  }

  async changeInfor(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false });
    }

    try {
      let { first_name, last_name, email } = req.body;
      first_name = first_name.trim();
      last_name = last_name.trim();
      email = email.trim();

      if (!first_name || !last_name || !email) {
        return res.json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin.',
        });
      }
      if (!isValidEmail(email)) {
        return res.json({
          success: false,
          message: 'Email không hợp lệ.',
        });
      }
      const data = verifyToken(token);
      const user = await User.findOne({ _id: data._id });
      if (!user) {
        return res.json({
          success: false,
          message: 'Không tìm thấy người dùng.',
        });
      }

      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;

      await user.save();
      res.json({
        success: true,
      });
    } catch (error) {
      res.json({ success: false });
    }
  }
  async changePassword(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false });
    }

    try {
      let { current_password, new_password, confirm_password } = req.body;

      if (!current_password || !new_password || !confirm_password) {
        return res.json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin.',
        });
      }
      if (new_password !== confirm_password) {
        return res.json({
          success: false,
          message: 'Mật khẩu mới và mật khẩu xác nhận không khớp.',
        });
      }
      if (!isStrongPassword(new_password)) {
        return res.json({
          success: false,
          message: 'Password yếu.',
        });
      }
      const data = verifyToken(token);
      const user = await User.findOne({ _id: data._id });
      if (!user) {
        return res.json({
          success: false,
          message: 'Không tìm thấy người dùng.',
        });
      }
      // Xác thực mật khẩu hiện tại
      const isCurrentPasswordValid = await comparePasswords(
        current_password,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return res.json({
          success: false,
          message: 'Mật khẩu hiện tại không chính xác.',
        });
      }
      // Cập nhật mật khẩu mới và lưu vào cơ sở dữ liệu
      const hashedPassword = await hashPassword(new_password);
      user.password = hashedPassword;
      await user.save();
      res.json({
        success: true,
      });
    } catch (error) {
      res.json({ success: false });
    }
  }
  Logout(req, res) {
    res.clearCookie('token');
    return res.redirect('/');
  }
  //
}

module.exports = new APIController();
