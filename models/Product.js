const mongoose = require('mongoose');

const ProductImageSchema = new mongoose.Schema({
	width: Number,
	height: Number,
	url: String,
	filename: String,
	size: Number,
	type: String,
	thumbnails: {
		small: {
			url: String,
			width: Number,
			height: Number,
		},
		large: {
			url: String,
			width: Number,
			height: Number,
		},
		full: {
			url: String,
			width: Number,
			height: Number,
		},
	},
});

const ProductSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'Please provide product name'],
			maxlength: [100, 'Name cannot be more than 100 characters'],
		},
		price: {
			type: Number,
			required: [true, 'Please provide product price'],
			default: 0,
		},
		subject: {
			type: String,
			required: [true, 'Please provide the subject'],
			maxlength: [100, 'Description cannot be more than 100 characters'],
		},
		level: {
			type: String,
			required: [true, 'Please provide the subject'],
			enum: [
				'senior high',
				'junior high',
				'upper primary',
				'lower primary',
				'kindergarten and nursery',
			],
		},
		image: [ProductImageSchema],
		category: {
			type: String,
			required: [true, 'Please provide product category'],
			enum: ['textbooks', 'questions and answers'],
		},
		company: {
			type: String,
			required: [true, 'Please provide company'],
			enum: {
				values: [
					'aplus',
					'best brain',
					'aki ola',
					'excellence',
					'a.a series',
					'alpha and omega',
					'masterman',
					'modern french',
					'victory',
					'GAST',
					'A1 challenge',
					'anointing',
					'atta kay',
					'concise',
					'golden',
					'in scope',
					'kosooko',
					"kov's",
					'mopac',
					'prof and figures',
				],
				message: '{VALUE} is not supported',
			},
		},
		featured: {
			type: Boolean,
			default: false,
		},
		description: {
			type: String,
			required: [true, 'Please provide product description'],
			maxlength: [1000, 'Description cannot be more than 1000 characters'],
		},
		inventory: {
			type: Number,
			required: true,
			default: 15,
		},
		averageRating: {
			type: Number,
			default: 0,
		},
		numOfReviews: {
			type: Number,
			default: 0,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

ProductSchema.virtual('reviews', {
	ref: 'Review',
	localField: '_id',
	foreignField: 'product',
	justOne: false,
});

ProductSchema.pre(
	'deleteOne',
	{ document: true, query: false },
	async function (next) {
		await this.model('Review').deleteMany({ product: this._id });
	}
);

module.exports = mongoose.model('Product', ProductSchema);
