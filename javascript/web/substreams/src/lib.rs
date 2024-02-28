use pb::out::Out;

mod pb;

#[substreams::handlers::map]
pub fn map_block_meta(params: String) -> Out {
    Out { params }
}
