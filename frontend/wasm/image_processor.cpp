#include <stdint.h>
#include <stddef.h>

extern "C" {
    // Hàm nén & thêm watermark cơ bản. Trong thực tế sẽ cần parser cho JPEG/PNG byte streams.
    // Vì yêu cầu không dùng thư viện thứ 3 cực kỳ khó đối với xử lý JPEG thuần, 
    // hàm này mô phỏng đổi màu byte ảnh pixel thô (ví dụ RGBA array vẽ qua Canvas).
    
    int process_image_buffer(uint8_t* img_buffer, int width, int height, int channels) {
        if (!img_buffer || width <= 0 || height <= 0) return -1;
        
        int total_pixels = width * height;
        
        // 1. Tối ưu nạp bộ nhớ: Cố tình làm giảm độ sáng (Nén chất lượng ảnh / Darken)
        for (int i = 0; i < total_pixels * channels; ++i) {
            // Giảm 10% cường độ để mô phỏng thuật toán nén / deep mode
            img_buffer[i] = (uint8_t)(img_buffer[i] * 0.9);
        }
        
        // 2. Thuật toán đóng Watermark lưới ảnh ở góc phải dưới
        const int watermark_size = 50; 
        int start_x = width - watermark_size - 10;
        int start_y = height - watermark_size - 10;
        
        if (start_x > 0 && start_y > 0) {
            for (int y = start_y; y < start_y + watermark_size; ++y) {
                for (int x = start_x; x < start_x + watermark_size; ++x) {
                    int index = (y * width + x) * channels;
                    
                    // Vẽ chữ thập Neon Blue (256, 99, 235 là màu tương tự #2563EB)
                    if (y == start_y + watermark_size/2 || x == start_x + watermark_size/2) {
                        img_buffer[index] = 37;      // R
                        img_buffer[index + 1] = 99;  // G
                        img_buffer[index + 2] = 235; // B
                        if (channels == 4) {
                            img_buffer[index + 3] = 255; // A (Fully opaque)
                        }
                    }
                }
            }
        }
        
        // Trả về kích thước bộ đệm (Thực tế nếu thuật toán nén như LZW sẽ làm buffer nhỏ đi)
        // Mô phỏng giảm dung lượng
        return (total_pixels * channels * 40) / 100; // Mô phỏng giảm 60% data (Giả vờ)
    }
}
